# Sourcerer-utilities

This project is part of Sourcerer, and used for parsing guidewire configuration files and config.ini files.

## xml_to_json.py

This is a script used to parse every single configuration file in a directory. It is the main file, and uses the files from modules folder: parseAppConfig and parseConfig. parseAppConfig goes through every file except the config.xml file, which is parsed by parseConfig. parseAppConfig determines data recursively. Essentially, the bulk of parsing is done through recursive_iterations. It will find an env tag, and carry that through to the bottom of the structure, if it doesn't find an env tag at the top, it will assume it's a default and append it to every environments structure. If an env tag is then found on a same property that already has a default, it will overwrite it with it's new value. All values that are defaults get a '(DEFAULT)' appeneded to them. This is something that could be changed in the future, but works well for now.

## xml_info_to_mongo.py

There are three main functions that do all the uploading.
