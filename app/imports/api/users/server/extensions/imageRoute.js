import fs from "fs";
import os from "os";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection.js";

Picker.route("/image/:path", function(params, req, res, next) {
  const { rootFolder } = Settings.findOne({
    rootFolder: { $ne: null }
  });

  const { path } = params;
  const filePath = rootFolder + Business.CLIENTS_FOLDER + "/" + path;
  const file = fs.readFileSync(filePath);

  res.writeHead(200, {
    "Content-Type": file.mimeType,
    "Content-Disposition": `attachment; filename=${params._id}.jpeg`,
    "Content-Length": file.length
  });
  res.end(file);
});
