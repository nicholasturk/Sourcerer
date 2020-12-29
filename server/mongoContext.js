var collections = {};
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

MongoClient.connect("mongodb://mislnxnp014:27017/:27017?readPreference=primary&appname=MongoDB%20Compass&ssl=false", {
   useUnifiedTopology: true,
})
   .then((client) => {
      const sourcerer_db = client.db("sourcerer");
      collections["ini"] = sourcerer_db.collection("ini");
      collections["acFilesInfo"] = sourcerer_db.collection("ac_files_info");
      collections["environments"] = sourcerer_db.collection("environments");
      collections["gitTemp"] = sourcerer_db.collection("environmentsGitTemp");
      collections["userActivity"] = sourcerer_db.collection("user_activity");
      console.log("Connected to MongoDb");
   })
   .catch((error) => {
      console.log(error);
   });

module.exports = {
   ObjectId,
   collections,
};
