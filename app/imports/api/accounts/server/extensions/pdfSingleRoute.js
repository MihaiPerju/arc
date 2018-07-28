import Uploads from "/imports/api/s3-uploads/uploads/collection";
import {
  getUserByToken
} from "/imports/api/s3-uploads/server/router";
import fs from "fs";
import Settings from "/imports/api/settings/collection.js";
import Business from "/imports/api/business";

Picker.route("/pdf/:_id/:token", function (params, req, res, next) {
  //Checking user rights
  const user = getUserByToken(params.token);
  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
  }


  const {
    rootFolder
  } = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });

  const {
    _id
  } = params;
  const {
    path
  } = Uploads.findOne({
    _id
  });
  let data = fs.readFileSync(rootFolder + Business.ACCOUNTS_FOLDER + path);

  res.end(data);
});