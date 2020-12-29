const mongoContext = require("../../mongoContext");
const { getSearchResults } = require("../application-configuration/routes");
const helper = require("../../helpers/application-configuration/helper");
const xl = require("excel4node");
const _ = require('underscore')

exports.getConfiguredFiles = (req, res) => {
   if (req.params.branch.endsWith(".json"))
      req.params.branch = req.params.branch.substring(0, req.params.branch.length - 5).toLowerCase();

   mongoContext.collections.environments
      .find({
         application: req.params.app,
         branch: req.params.branch,
         environment: req.params.env,
      })
      .toArray((err, docs) => {
         var fileNamesMissing = [];
         var tNames = new Set();
         var propsToSend = {};
         var toSend = {};
         var numProps = 0;
         var missingFiles = 0;

         docs.forEach((doc) => {
            if (Object.keys(doc.configured_props).length > 0) {
               tNames.add(doc.file_name);
               numProps += Object.keys(doc.configured_props).length;
               Object.keys(doc.configured_props).forEach((prop) => {
                  if (prop in propsToSend) propsToSend[prop].push(doc.file_name);
                  else {
                     propsToSend[prop] = [doc.file_name];
                  }
               });
            } else {
               fileNamesMissing.push(doc.file_name);
               missingFiles += 1;
            }
         });

         toSend["fileNamesMissing"] = fileNamesMissing;
         toSend["missingFiles"] = missingFiles;
         toSend["numFiles"] = [...tNames].length;
         toSend["numProps"] = numProps;

         toSend["fileNames"] = [...tNames];
         toSend["allProps"] = propsToSend;

         res.send(toSend);
      });
};

exports.getPropertiesByFileAndEnv = (req, res) => {
   mongoContext.collections.environments.findOne(
      {
         application: req.params.app,
         branch: req.params.branch.replace(".json", "").toLowerCase(),
         environment: req.params.env,
         file_name: req.params.file,
      },
      (err, doc) => {
         if (err) {
            res.send("Error");
         } else {
            res.send(doc.configured_props);
         }
      }
   );
};

exports.downloadEnvVsAllReport = async (req, res) => {

   var application = req.body.env;
   var branch = req.body.branch.replace(".json", "").toLowerCase();
   var subSets = [...req.body.selectedSubsets]
   var data = req.body.data;
   var columnHeaders = ["FileName"]
   var envs = Object.keys(data);
   var envCombinations = helper.getAllSubsets(envs);
   var allFiles = [];
   var toWrite = {}

   try {
      allFiles = new Set(
         await mongoContext.collections.acFilesInfo.distinct("file_name", {
            application: req.body.application,
            branch: req.body.branch.replace(".json", "").toLowerCase(),
         })
      );
   } catch (err) {
      res.send(err);
   }

   // Get all filenames
   envs.forEach(env => {
      subSets.push([env])
      data[env].fileNames.forEach(file => {
         if (!(file in toWrite)) toWrite[file] = new Set()
      })
   });

   subSets.sort((a, b) => a.length - b.length);

   // Add all subsets
   subSets.forEach(subset => {
      var myArrays = []
      var subColName = ''
      subset.forEach((env, idx) => {
         subColName += idx == subset.length - 1 ? `${env}` : `${env}/` 
         myArrays.push(data[env].fileNames)
      })
      columnHeaders.push(subColName)
      var subsetIntersection = _.intersection(...myArrays);
      subsetIntersection.forEach(file_name => toWrite[file_name].add(subColName))
   })

   var wb = new xl.Workbook();
   var ws = wb.addWorksheet("Comparison Report");

   // Cell styling
   var headerCellStyle = wb.createStyle({
      font: {
         color: "#000000",
         size: 12,
      },
   });

   var valueCellStyle = wb.createStyle({
      font: {
         color: "#505250",
         size: 10,
      },
   });

   ws.column(1).setWidth(35)

   // Write headers
   columnHeaders.forEach((header, idx) => {
      ws.cell(1, idx + 1).string(header).style(headerCellStyle);
      ws.column(idx + 2).setWidth(15)
   });

   // Write data
   columnHeaders.forEach((subSet, i) => {
      var column = i + 2;
      Object.keys(toWrite).forEach((fileName, row) => {
         if(column == 2) ws.cell(row + 2, column - 1).string(fileName).style(valueCellStyle);
         else{
            ws.cell(row + 2, column - 1).string(
               toWrite[fileName].has(subSet) ? 'True' : 'False'
            ).style(valueCellStyle)
         }
      })
   })

   // Write workbook
   try {
      console.log("Success");
      wb.write("Report.xlsx", res);
   } catch (err) {
      res.send(err);
   }

};

exports.getEnvs = async (req, res) => {
   var envs = await mongoContext.collections.acFilesInfo.distinct("environment", { application: req.params.app });
   res.send(envs);
};
