from modules.parseConfig import gen_config
from modules.parseAppConfig import gen_app_config
import collections
from collections import OrderedDict
import json

def combine_data(app_config, config):

    result = {}

    for env in app_config:

        if env not in result: result[env] = dict()

        result[env]["app_config"] = app_config[env]
        if env in config: result[env]["config"] = config[env] 


    result["global_configs"] = config["global_configs"]

    return result


def main():

    envs = gen_app_config(True, [])
    print(envs)
    result = combine_data(gen_app_config(False, envs), gen_config(envs))
    ordered = OrderedDict(sorted(result.iteritems(), key=lambda x:x[0].lower()))
    for env in ordered:
        if env != "global_configs":
            ordered[env]["app_config"] = OrderedDict(sorted(ordered[env]["app_config"].iteritems(), key=lambda x:x[0].lower()))

    with open('result.json', 'w') as fp:
        json.dump(ordered, fp)

if __name__ == '__main__':
    main()
