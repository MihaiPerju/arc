import fs from "fs";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection.js";
import Uploads from "/imports/api/uploads/uploads/collection";

Picker.route("/image/:path", function (params, req, res) {
  const {
    rootFolder
  } = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });

  const {
    path
  } = params;
  const filePath = rootFolder + Business.CLIENTS_FOLDER + path;
  const {
    mimeType
  } = Uploads.findOne({
    path
  });
  if (!fs.existsSync(filePath)) {

    res.writeHead(404);
    res.write('File Not Found');
    res.end();
  }
  const file = fs.readFileSync(filePath);

  res.writeHead(200, {
    "Content-Type": mimeType,
    "Content-Disposition": `attachment; filename=${params.path}.jpeg`
  });
  res.end(file);
});