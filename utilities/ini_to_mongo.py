import os
import sys
from pymongo import MongoClient


def file_list(folder_to_read):
    files_to_parse = []
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../" + folder_to_read)

    for root, _, files in os.walk(path):
        for f in files:
            if f.endswith(".ini"):
                files_to_parse.append(os.path.abspath(os.path.join(root, f)))

    return files_to_parse


def get_columns(folder_to_read):

    columns = {"application", "environment"}

    for f in file_list(folder_to_read):
        split_f = f.split("/")
        if split_f[len(split_f) - 2] == "prod":
            with open(f, "r") as to_read:
                for l in to_read.readlines():
                    try:
                        columns.add(l.split("=")[0])
                    except:
                        print("No equal")
    return columns


def parse_config(file_path, columns):

    to_insert = {}
    with open(file_path, "r") as f:
        split_f = file_path.split("/")
        env_name = split_f[len(split_f) - 2]
        to_insert["environment"] = env_name
        for l in f.readlines():
            line = l.rstrip("\n")
            key_pair = line.split("=")
            if len(key_pair) == 2:
                if key_pair[0] == "application":
                    to_insert["application"] = key_pair[1]
                else:
                    to_insert[key_pair[0]] = (key_pair[1] if key_pair[1] != "" else "None")
            else:
                to_insert[key_pair[0]] = "None"

    for col in columns:
        if col not in to_insert:
            to_insert[col] = "None"

    return to_insert


if __name__ == "__main__":

    if len(sys.argv) < 2: exit()

    folder_to_read = sys.argv[1]
    ini_collection = MongoClient("mislnxnp014", 27017).sourcerer.ini

    items = []
    columns = get_columns(folder_to_read)

    for f in file_list(folder_to_read):
        items.append(parse_config(f, columns))

    ini_collection.drop()
    ini_collection.insert_many(items)