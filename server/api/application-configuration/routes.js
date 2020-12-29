const helper = require("../../helpers/application-configuration/helper.js");
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;
const mongoContext = require("../../mongoContext");
const xl = require("excel4node");

exports.getProps = (req, res) => {

   console.log(req);
   res.send(helper.getProps(req.body.envs, req.body.branches, req.body.app, req.body.key, req.body.choice));
};

// Returns data in pretty format for front end
exports.getCompareTableData = (req, res) => {
   res.send(helper.getTableData(req.body.envs, req.body.branches, req.body.app, req.body.key, req.body.choice));
};

// Returns a list of all environments
exports.getEnvs = (req, res) => {
   var obj = JSON.parse(fs.readFileSync(`${__dirname}/` + helper.filePath(req.params.app, req.params.branch)));
   var keys = Object.keys(obj);
   keys = keys.filter((item) => item !== "global_configs");
   res.send(keys);
};

// Returns a list of keys
exports.getKeys = (req, res) => {
   var obj = JSON.parse(fs.readFileSync(`${__dirname}/` + helper.filePath(req.params.app, req.params.branch)));
   // This is hardcoded
   var toSend =
      req.params.choice.toLowerCase() == "app"
         ? Object.keys(obj["dev"]["app_config"])
         : Object.keys(obj["dev"]["config"]["databases"]);
   res.send(toSend);
};

// Search function, code was put into the helper method because it was messy
exports.getSearchResults = (req, res) => {
   res.send(helper.getSearchResults(req.params.app, req.params.branch, req.params.query, req.params.precision));
};

// Returns a list of file names from the app name
exports.getBranchNames = (req, res) => {
   var fileNames = [];
   fs.readdirSync(path.normalize(__dirname + "/./../../branches/" + req.params.app)).forEach((file) => {
      fileNames.push(file);
   });
   res.send(fileNames);
};

// Updates branches (with wget command)
// This doesn't work very well locally for some reason, sometimes you have to type this command into the terminal while in the sourcerer-server directory for it to work
exports.refreshBranches = (req, res) => {
   exec(
      `wget http://csiartifactory.cgic.ca/artifactory/gradle-dev-local/HEAD/ca/cooperators/utilities/sourcerer/PC/latest/HEAD.json -O branches/pc/HEAD.json && wget http://csiartifactory.cgic.ca/artifactory/gradle-dev-local/MAINTENANCE_LONG_TERM/ca/cooperators/utilities/sourcerer/PC/latest/MAINTENANCE_LONG_TERM.json -O branches/pc/MAINTENANCE_LONG_TERM.json && wget http://csiartifactory.cgic.ca/artifactory/gradle-dev-local/MAINTENANCE_LONG_TERM/ca/cooperators/utilities/sourcerer/BC/latest/MAINTENANCE_LONG_TERM.json -O branches/bc/MAINTENANCE_LONG_TERM.json && wget http://csiartifactory.cgic.ca/artifactory/gradle-dev-local/HEAD/ca/cooperators/utilities/sourcerer/BC/latest/HEAD.json -O branches/bc/HEAD.json`,
      (error, stdout, stderr) => {
         if (error) {
            res.send(error.message);
            return;
         }
         if (stderr) {
            res.send(stderr);
            return;
         } else {
            res.send("Successfully retrieved files");
         }
      }
   );
};

// Returns a document from the ac_files_info collection
exports.getFileInfo = async (req, res) => {
   mongoContext.collections.acFilesInfo
      .find({ application: req.params.app, branch: req.params.branch })
      .toArray((err, docs) => {
         res.send(docs);
      });
};

// Report download
exports.genReport = async (req, res) => {
   console.log("Generating report....");

   const headers = ["Application", "Branch", "Environment", "App Config File"];

   //Create workbook and add a worksheet
   var wb = new xl.Workbook();
   var ws = wb.addWorksheet("Missing Entry Report");

   // Cell styling
   var headerCellStyle = wb.createStyle({
      font: {
         color: "#000000",
         size: 14,
      },
   });

   var valueCellStyle = wb.createStyle({
      font: {
         color: "#505250",
         size: 12,
      },
   });

   // Write headers
   headers.forEach((header, idx) => {
      switch (idx + 1) {
         case 1:
            ws.column(idx + 1).setWidth(14);
            break;
         case 2:
            ws.column(idx + 1).setWidth(34);
            break;
         case 3:
            ws.column(idx + 1).setWidth(20);
            break;
         case 4:
            ws.column(idx + 1).setWidth(50);
            break;
      }
      ws.cell(1, idx + 1)
         .string(header)
         .style(headerCellStyle);
   });

   //Write all variable cells, 'i' starts at 2 because its the second row (after the headers)
   var i = 2;
   for (const application of await mongoContext.collections.environments.distinct("application")) {
      for (const branch of await mongoContext.collections.environments.distinct("branch", {
         application: application,
      })) {
         for (const doc of await mongoContext.collections.environments
            .aggregate(helper.reportPipe(application, branch))
            .toArray()) {
            ws.cell(i, 1).string(application).style(valueCellStyle);
            ws.cell(i, 2).string(branch).style(valueCellStyle);
            ws.cell(i, 3).string(doc.environment).style(valueCellStyle);
            ws.cell(i, 4).string(doc.file_name).style(valueCellStyle);
            i += 1;
         }
      }
   }

   try {
      console.log("Success");
      wb.write("Report.xlsx", res);
   } catch (err) {
      res.send(err);
   }
};

// Pipeline call to get git differences, it must be cast toArray() for some odd reason
exports.getGitDifferences = async (req, res) => {
   res.send(await mongoContext.collections.environments.aggregate(helper.gitDiffPipe(req.params.app)).toArray());
};

exports.getConflictingProperties = (req, res) => {
   res.send(
      helper.getConflictingProperties(
         req.body.app,
         req.body.branch,
         req.body.primaryEnv,
         req.body.envsToComp,
         req.body.filesToIgnore
      )
   );
};
