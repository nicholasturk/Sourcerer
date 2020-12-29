import json
import copy
import sys
from pymongo import MongoClient

global ac_files_info_col
global ac_config_info_col
global environments_col


def get_obj():

    t = json.load(open("result.json"))
    t.pop("global_configs", None)
    return t


def gen_missing_envs(json_obj, app, branch):

    num_envs = len(json_obj.keys())
    file_names = json_obj["dev"]["app_config"].keys()
    final = []

    for file_name in file_names:
        to_count = num_envs
        to_insert = {
            "file_name": file_name,
            "application": app,
            "branch": branch.replace(".json", ""),
            "missing_envs": [],
        }
        for env in json_obj:
            has_tag = False
            for pair in json_obj[env]["app_config"][file_name]:
                if (
                    str(pair["@value"]).endswith("(DEFAULT)") == False
                ):  # An env tag was found somewhere in file
                    has_tag = True
                    break
            if not has_tag:
                to_count -= 1
                to_insert["missing_envs"].append(env)
        to_insert["num_envs"] = to_count
        final.append(copy.deepcopy(to_insert))

    ac_files_info_col.insert_many(final)


def gen_all_properties(json_obj, app, branch):

    file_names = json_obj["dev"]["app_config"].keys()

    for file_name in file_names:

        def_props = dict()
        all_props = set()
        only_defaults = True

        # Get properties
        for env in json_obj:
            for pair in json_obj[env]["app_config"][file_name]:
                if "@name" in pair:
                    all_props.add(pair["@name"])
                    if str(pair["@value"]).endswith("(DEFAULT)"):
                        if pair["@name"].startswith("$") == False:
                            def_props[pair["@name"]] = pair["@value"].replace(
                                " (DEFAULT)", ""
                            )
                    else:
                        only_defaults = False

        # Update document
        ac_files_info_col.update_one(
            {
                "file_name": file_name,
                "application": app,
                "branch": branch.replace(".json", ""),
            },
            {
                "$set": {
                    "all_properties": list(all_props),
                    "default_properties": def_props,
                    "only_defaults": only_defaults,
                }
            },
        )


def gen_env_info(obj, app, branch):

    envs = obj.keys()
    to_insert = []

    for env in envs:
        temp = {"environment": env, "application": app, "branch": branch}
        for f in obj[env]["app_config"]:
            temp["file_name"] = f
            props = {}
            for prop in obj[env]["app_config"][f]:
                if "@name" in prop and "@value" in prop:
                    props[
                        prop["@name"].replace(".", "_").replace("$", "DOLLAR")
                    ] = prop["@value"]

            temp["all_props"] = copy.deepcopy(props)
            temp["configured_props"] = {}

            for prop in props:
                if str(props[prop]).endswith("(DEFAULT)") == False:
                    temp["configured_props"][prop] = copy.deepcopy(props[prop])

            if len(props.keys()) > 0:
                to_insert.append((copy.deepcopy(temp)))

    environments_col.insert_many(to_insert)


if __name__ == "__main__":

    app_name = sys.argv[1].lower()
    branch_name = sys.argv[2].lower()

    db = MongoClient("mislnxnp014", 27017).sourcerer

    ac_files_info_col = db.ac_files_info
    environments_col = db.environments

    # Beginning of all builds, drop the collections
    if(app_name == 'pc' and branch_name == 'head'):
        ac_files_info_col.drop()
        environments_col.drop()

    obj = get_obj()
    print('\nGenerating missing environments...')
    gen_missing_envs(obj, app_name, branch_name)
    print('Generating all properties...')
    gen_all_properties(obj, app_name, branch_name)
    print('Generating environment info...')
    gen_env_info(obj, app_name, branch_name)
