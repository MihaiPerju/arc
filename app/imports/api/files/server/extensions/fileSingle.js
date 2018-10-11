import Files from "/imports/api/files/collection";
import { getUserByToken } from "/imports/api/uploads/server/router";
import fs from "fs";
import Business from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

Picker.route("/file/:_id/:token", function(params, req, res) {
  //Checking user rights
  const user = getUserByToken(params.token);
  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
  }

  const { root } = SettingsService.getSettings(settings.ROOT);

  const { _id } = params;
  const { fileName } = Files.findOne({
    _id
  });
  if (!fs.existsSync(root + Business.ACCOUNTS_FOLDER + fileName)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }

  let data = fs.readFileSync(root + Business.ACCOUNTS_FOLDER + fileName);
  res.setHeader(
    "Content-disposition",
    "attachment; filename=" + fileName.split(".")[0] + ".csv"
  );
  res.writeHead(200, {
    "Content-Type": "text/csv"
  });

  res.end(data);
});
