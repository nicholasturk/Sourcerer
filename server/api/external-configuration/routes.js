const mongoContext = require("../../mongoContext");
const ObjectId = mongoContext.ObjectId;

exports.getDocument = (req, res) => {
   mongoContext.collections.ini.findOne({ application: req.params.app, environment: req.params.env }, (err, item) => {
      if (err) {
         res.sendStatus("Error");
      } else {
         res.send(item);
      }
   });
};

exports.getApps = async (req, res) => {
   var apps = await mongoContext.collections.ini.distinct("application");
   res.send(apps);
};

exports.getEnvs = async (req, res) => {
   var envs = await mongoContext.collections.ini.distinct("environment", { application: req.params.app });
   res.send(envs);
};

exports.updateDocument = (req, res) => {
   req.body._id = ObjectId(req.body._id);
   mongoContext.collections.ini.replaceOne({ _id: req.body._id }, req.body);

   console.log("Updated document");
   res.sendStatus(200);
};

exports.updateApplication = (req, res) => {
   req.body.add.forEach((toAdd) => {
      mongoContext.collections.ini.updateMany({ application: req.body.app }, { $set: { [toAdd.key]: toAdd.value } });
   });

   req.body.rem.forEach((toRem) => {
      mongoContext.collections.ini.updateMany(
         { application: req.body.app },
         { $unset: { [toRem]: 1 } },
         { multi: true }
      );
   });

   res.sendStatus(200);
};
