import Files from "/imports/api/files/collection";
import { getUserByToken } from "/imports/api/s3-uploads/server/router";
import fs from "fs";
import Settings from "/imports/api/settings/collection.js";
import Business from "/imports/api/business";

Picker.route("/file/:_id/:token", function(params, req, res, next) {
  //Checking user rights
  const user = getUserByToken(params.token);
  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
  }

  const { rootFolder } = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });

  const { _id } = params;
  const { fileName } = Files.findOne({
    _id
  });
  if (!fs.existsSync(rootFolder + Business.ACCOUNTS_FOLDER + fileName)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }

  let data = fs.readFileSync(rootFolder + Business.ACCOUNTS_FOLDER + fileName);
  res.setHeader(
    "Content-disposition",
    "attachment; filename=" + fileName.split(".")[0] + ".csv"
  );
  res.writeHead(200, {
    "Content-Type": "text/csv"
  });

  res.end(data);
});
