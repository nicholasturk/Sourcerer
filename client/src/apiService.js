import axios from "axios";

/*
This file makes calls to the backend to grab the appropriate data,
Most calls are make through store.js in the form of actions because they mutate the state and are asyncronous actions,
See API DOCS on front end to figure out what these calls do
*/

const url = "http://mislnxnp014:8615";
const appConfigRoute = `${url}/api/application-configuration`;
const externalConfigRoute = `${url}/api/external-configuration`;
const profileViewRoute = `${url}/api/profile-view`;

class PostService {
   static getFileNames(application) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(appConfigRoute + "/getBranchNames/" + application);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getEnvs(application, branch) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(appConfigRoute + "/getEnvs/" + application + "/" + branch);
            resolve(res);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getKeys(application, branch, whatToView) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(appConfigRoute + "/getKeys/" + application + "/" + branch + "/" + whatToView);
            resolve(res);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getCompareTableData(body) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.post(appConfigRoute + "/getCompareTableData", body);
            resolve(res);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getProperties(body) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.post(appConfigRoute + "/getProperties", body);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static refreshBranches() {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(appConfigRoute + "/refreshBranches");
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static search(opts) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(
               appConfigRoute +
                  "/getSearchResults/" +
                  opts.app +
                  "/" +
                  opts.branch +
                  "/" +
                  opts.query +
                  "/" +
                  opts.precision
            );
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getApps() {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(externalConfigRoute + "/getApps");
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getEnvsByApp(app) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(externalConfigRoute + "/getEnvs/" + app);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static configSingleObject(app, env) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(externalConfigRoute + "/getDocument/" + app + "/" + env);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static updateIniDocument(document) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.post(externalConfigRoute + "/updateDocument", document);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static updateApplication(body) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.post(externalConfigRoute + "/updateApplication", body);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getFileInfo(app, branch) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(
               appConfigRoute + "/getFilesOverview/" + app + "/" + branch.replace(".json", "")
            );
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getConfiguredFiles(app, branch, env) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(appConfigRoute + "/getEnvironmentOverview/" + app + "/" + branch + "/" + env);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getPropertiesByFileAndEnv(body) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(
               `${appConfigRoute}/getPropertiesByFileAndEnv/${body.app}/${body.branch}/${body.env}/${body.file}`
            );
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static generateReport() {
      axios
         .get(`${appConfigRoute}/genReport`, {
            responseType: "blob",
         })
         .then((response) => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([response.data]));
            link.setAttribute("download", "Report.xlsx");
            document.body.appendChild(link);
            link.click();
         });
   }

   static getGitDifferences(app) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.get(`${appConfigRoute}/getGitDifferences/${app}`);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static getConflictingProperties(body) {
      return new Promise(async (resolve, reject) => {
         try {
            const res = await axios.post(`${appConfigRoute}/getConflictingProperties`, body);
            resolve(res.data);
         } catch (err) {
            reject(err);
         }
      });
   }

   static envVsAllReport(params) {
      axios.post(`${profileViewRoute}/envVsAllReport`, params, {
         responseType: "blob"
      }).then((response) => {
         const link = document.createElement("a");
         link.href = window.URL.createObjectURL(new Blob([response.data]));
         link.setAttribute("download", "Report.xlsx");
         document.body.appendChild(link);
         link.click();
      });
   }
}

export default PostService;
