import fs from "fs";
import Business from "/imports/api/business";
import Uploads from "/imports/api/uploads/uploads/collection";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";
import Path from "path"

Picker.route("/image/:name", function(params, req, res) {
  const { root } = SettingsService.getSettings(settings.ROOT);

  const { name} = params;
  const filePath = Path.join(root,Business.CLIENTS_FOLDER, name);
  console.log(name)
  const { mimeType } = Uploads.findOne({
    name
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
