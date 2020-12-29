const path = require("path");

module.exports = {
   outputDir: path.resolve(__dirname, "../sourcerer-server/public"),
   configureWebpack: {
      devServer: {
         host: "localhost",
      },
   },
};
