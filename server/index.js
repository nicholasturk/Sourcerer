const fs = require("fs");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger-config");
const security = require("./security");
const mongoContext = require("./mongoContext");

// Routing methods
const applicationConfiguration = require("./api/application-configuration/routes");
const externalConfiguration = require("./api/external-configuration/routes");
const profileView = require("./api/profile-view/routes");
const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(cors());

const appConfigRoute = "/api/application-configuration";
const externalConfigRoute = "/api/external-configuration";
const profileViewRoute = "/api/profile-view";

function noCache(req, res, next) {
   res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
   res.header("Expires", "-1");
   res.header("Pragma", "no-cache");
   next();
}

app.get(`${appConfigRoute}/getEnvs/:app/:branch`, applicationConfiguration.getEnvs);
app.get(`${appConfigRoute}/getKeys/:app/:branch/:choice`, applicationConfiguration.getKeys);
app.get(`${appConfigRoute}/getSearchResults/:app/:branch/:query/:precision`, applicationConfiguration.getSearchResults);
app.get(`${appConfigRoute}/getBranchNames/:app`, applicationConfiguration.getBranchNames);
app.get(`${appConfigRoute}/refreshBranches`, applicationConfiguration.refreshBranches);
app.get(`${appConfigRoute}/getFilesOverview/:app/:branch`, applicationConfiguration.getFileInfo);
app.get(`${appConfigRoute}/genReport`, applicationConfiguration.genReport);
app.get(`${appConfigRoute}/getGitDifferences/:app`, applicationConfiguration.getGitDifferences);
app.get(`${appConfigRoute}/getEnvironmentOverview/:app/:branch/:env`, profileView.getConfiguredFiles);
app.get(`${appConfigRoute}/getPropertiesByFileAndEnv/:app/:branch/:env/:file`, profileView.getPropertiesByFileAndEnv);
app.post(`${appConfigRoute}/getProps`, applicationConfiguration.getProps);
app.post(`${appConfigRoute}/getCompareTableData`, applicationConfiguration.getCompareTableData);
app.post(`${appConfigRoute}/getConflictingProperties`, applicationConfiguration.getConflictingProperties);

//External configuration routes
app.post(`${externalConfigRoute}/updateDocument`, externalConfiguration.updateDocument);
app.post(`${externalConfigRoute}/updateApplication`, externalConfiguration.updateApplication);
app.get(`${externalConfigRoute}/getDocument/:app/:env`, externalConfiguration.getDocument);
app.get(`${externalConfigRoute}/getEnvs/:app`, externalConfiguration.getEnvs);
app.get(`${externalConfigRoute}/getApps`, externalConfiguration.getApps);

//Profile view routes
app.post(`${profileViewRoute}/envVsAllReport`, profileView.downloadEnvVsAllReport);

// Handles index.html
app.use(express.static(__dirname + "/public"));
app.get(/.*/, (req, res) => {
   var eip = req.ip;
   mongoContext.collections.userActivity.updateOne({ ip: eip }, { $inc: { times_visited: 1 } }, { upsert: true });
   res.sendFile(__dirname + "/public/index.html");
});

// Listen on specified port
const port = process.env.PORT || 8615;
app.listen(port, () => {
   console.log("Server started on port " + port);
});
