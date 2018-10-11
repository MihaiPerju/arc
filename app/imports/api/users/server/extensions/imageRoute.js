import fs from "fs";
import Business from "/imports/api/business";
import Uploads from "/imports/api/uploads/uploads/collection";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

Picker.route("/image/:path", function(params, req, res) {
  const { root } = SettingsService.getSettings(settings.ROOT);

  const { path } = params;
  const filePath = root + Business.CLIENTS_FOLDER + path;
  const { mimeType } = Uploads.findOne({
    path
  });
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }
  const file = fs.readFileSync(filePath);

  res.writeHead(200, {
    "Content-Type": mimeType,
    "Content-Disposition": `attachment; filename=${params.path}.jpeg`
  });
  res.end(file);
});
