import Uploads from "/imports/api/uploads/uploads/collection";
import { getUserByToken } from "/imports/api/uploads/server/router";
import fs from "fs";
import Business from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

Picker.route("/pdf/:_id/:accountId/:token", function(params, req, res) {
  //Checking user rights
  const user = getUserByToken(params.token);
  const { accountId } = params;

  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
  }

  const { root } = SettingsService.getSettings(settings.ROOT);

  const { _id } = params;
  const { path } = Uploads.findOne({
    _id
  });
  if (
    !fs.existsSync(root + Business.ACCOUNTS_FOLDER + accountId + "/" + path)
  ) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }

  let data = fs.readFileSync(
    root + Business.ACCOUNTS_FOLDER + accountId + "/" + path
  );

  res.end(data);
});
