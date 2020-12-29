const { response } = require("express");
const fs = require("fs");
const fuzz = require("fuzzball");
const path = require("path");

let filePath = (app, name) => `../../branches/${app}/${name + (name.endsWith(".json") ? "" : ".json")}`;
let remExt = (str) => str.split(".").slice(0, -1).join(".");

let getToScan = (envObj, key, choice) => {
   var ret;
   switch (choice) {
      case "config":
         ret = envObj.config.other_attrs;
         break;
      case "db":
         ret = key in envObj.config.databases ? envObj.config.databases[key] : [];
         break;
      case "app":
         ret = key in envObj.app_config ? envObj.app_config[key] : [];
         break;
      case "global":
         ret = envObj;
         break;
      default:
         ret = [];
   }
   return ret;
};

let getCols = (envs, branches, choice) => {
   var cols = ["Property"];

   branches.forEach((branch) => {
      if (choice == "global") cols.push(`Value - ${remExt(branch)}`);
      else {
         envs.forEach((env) => {
            cols.push(`${env} - ${remExt(branch)}`);
         });
      }
   });
   return cols;
};

let getProps = (envs, branches, app, key, choice) => {
   var props = new Set();
   var toIter = {};

   branches.forEach((branch) => {
      var obj = JSON.parse(fs.readFileSync(`${__dirname}/` + filePath(app, branch)));
      envs.forEach((env) => {
         toIter = getToScan(obj[env], key, choice);
         toIter.forEach((prop) => {
            if (prop) props.add(prop["@name"]);
         });
      });
   });
   return Array.from(props);
};

let getTableData = (envs, branches, app, key, choice) => {
   var data = [];
   var branchObjs = [];
   var row, toScan, value;
   var props = getProps(envs, branches, app, key, choice);

   branches.forEach((branch) => {
      branchObjs.push({ obj: JSON.parse(fs.readFileSync(`${__dirname}/` + filePath(app, branch))), name: branch });
   });

   props.forEach((prop) => {
      row = { Property: prop };
      branchObjs.forEach((branch) => {
         envs.forEach((env) => {
            value = false;
            toScan = getToScan(branch.obj[env], key, choice);
            for (let i = 0; i < toScan.length; i++) {
               if (typeof toScan[i] != "string" && "@value" in toScan[i]) {
                  if (toScan[i]["@name"] == prop) {
                     value = String(toScan[i]["@value"]);
                     break;
                  }
               }
            }
            var colName = choice == "global" ? "Value" : env;
            row[`${colName} - ${remExt(branch.name)}`] = !value ? "Not found" : value;
         });
      });
      data.push(row);
   });

   var cols = getCols(envs, branches, choice);

   return {
      data: data,
      cols: cols,
   };
};

let getSearchResults = (app, branch, searchTerm, precision) => {
   // Get file
   const rd = fs.readFileSync(path.normalize(__dirname + "/./" + filePath(app, branch)));
   const jd = JSON.parse(rd);

   // Fuzzy search options
   var options = { scorer: fuzz.token_set_ratio };
   var ret = {};

   var items = [];
   var isPropSearch = true;

   Object.keys(jd).forEach((env) => {
      if ("app_config" in jd[env]) {
         Object.keys(jd[env]["app_config"]).forEach((file) => {
            jd[env]["app_config"][file].forEach((prop) => {
               prop.env = env;
               prop.file = file;
               items.push(prop);
            });
         });
      }
      if ("config" in jd[env]) {
         jd[env]["config"]["other_attrs"].forEach((prop) => {
            prop.env = env;
            prop.file = "config.xml";
            items.push(prop);
         });
      }
   });

   // Criteria for fuzzy searching
   options.returnObjects = true;
   options.cutoff = parseInt(precision) > 95 ? 95 : parseInt(precision);
   options.scorer = fuzz.token_sort_ratio;

   // Get ratios for names
   options.processor = (choice) => choice["@name"];
   var nameRatios = fuzz.extract(searchTerm, items, options);
   nameRatios.forEach((choice) => {
      choice.foundOn = "@name";
   });

   // Get ratior for values
   options.processor = (choice) => choice["@value"];
   var valueRatios = fuzz.extract(searchTerm, items, options);
   valueRatios.forEach((choice) => {
      choice.foundOn = "@value";
   });

   // Sort the concatinated arrays
   var complete = nameRatios.concat(valueRatios);
   complete.sort((a, b) => b.score - a.score);

   var toSend = ret;

   // Return a the highest matching items only
   if (isPropSearch) {
      toSend.type = "many";
      toSend.items = {};

      complete.forEach((item) => {
         var relKey = item.choice[item.foundOn];

         if (!(relKey in toSend.items)) toSend.items[relKey] = [];
         toSend.items[relKey].push(item);
      });
   }

   return toSend;
};

let getConflictingProperties = (app, branch, primaryEnv, envsToComp, filesToIgnore) => {
   const obj = JSON.parse(fs.readFileSync(path.normalize(__dirname + "/./" + filePath(app, branch))));

   var ret = {};
   envsToComp.forEach((env) => (ret[env] = {}));

   var files = new Set();
   var filesToIgnoreSet = new Set(filesToIgnore);

   // Get files to check against
   Object.keys(obj[primaryEnv]["app_config"]).forEach((file) => {
      filesToIgnoreSet.has(file) ? null : files.add(file);
   });

   envsToComp.forEach((env) => {
      files.forEach((file) => {
         ret[env][file] = {};
      });
   });

   // Compare app config
   files.forEach((file) => {
      // Add each file to each env

      var temp_set = {};
      var primaryToScan = obj[primaryEnv]["app_config"][file];

      primaryToScan.forEach((prop) => {
         temp_set[prop["@name"]] = prop["@value"];
      });

      envsToComp.forEach((env) => {
         var sec_temp_set = {};
         var secondayToScan = obj[env]["app_config"][file];

         secondayToScan.forEach((prop) => {
            sec_temp_set[prop["@name"]] = prop["@value"];
         });

         Object.keys(temp_set).forEach((propName) => {
            if (!(propName in sec_temp_set)) {
               ret[env][file][propName] = {};
               ret[env][file][propName]["conflictType"] = "Not found in secondary";
               ret[env][file][propName]["primValue"] = temp_set[propName];
               ret[env][file][propName]["secValue"] = "Not found.";
            }
         });

         Object.keys(sec_temp_set).forEach((propName) => {
            if (!(propName in temp_set)) {
               ret[env][file][propName] = {};
               ret[env][file][propName]["conflictType"] = "Not found in primary";
               ret[env][file][propName]["primValue"] = "Not found";
               ret[env][file][propName]["secValue"] = sec_temp_set[propName];
            } else if (temp_set[propName] != sec_temp_set[propName]) {
               ret[env][file][propName] = {};
               ret[env][file][propName]["conflictType"] = "Different values";
               ret[env][file][propName]["primValue"] = temp_set[propName];
               ret[env][file][propName]["secValue"] = sec_temp_set[propName];
            }
         });
      });
   });

   return ret;
};

let reportPipe = (app, branch) => {
   return [
      {
         $match: {
            application: app,
            branch: branch,
         },
      },
      {
         $project: {
            environment: 1,
            file_name: 1,
            application: 1,
            configured_props: {
               $objectToArray: "$configured_props",
            },
         },
      },
      {
         $match: {
            "configured_props.0": {
               $exists: false,
            },
         },
      },
      {
         $project: {
            environment: 1,
            application: 1,
            file_name: 1,
         },
      },
   ];
};

let gitDiffPipe = (app) => {
   return [
      {
         $match: {
            application: app,
         },
      },
      {
         $addFields: {
            configured_props_holder: "$configured_props",
         },
      },
      {
         $set: {
            "configured_props_holder.branch": "$branch",
         },
      },
      {
         $group: {
            _id: {
               environment: "$environment",
               file_name: "$file_name",
            },
            configured_props: {
               $addToSet: "$configured_props",
            },
            configured_props_holder: {
               $addToSet: "$configured_props_holder",
            },
         },
      },
      {
         $match: {
            "configured_props.1": {
               $exists: true,
            },
         },
      },
   ];
};

let getAllSubsets = (arr) => {
   var ret = arr.reduce((subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])), [[]]);
   for (let i = ret.length - 1; i >= 0; i--) {
      if(ret[i].length <= 1) ret.splice(i, 1);
   }
   return ret;
}

module.exports = {
   getProps,
   getAllSubsets,
   getTableData,
   filePath,
   reportPipe,
   gitDiffPipe,
   getSearchResults,
   getConflictingProperties,
};
