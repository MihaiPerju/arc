import { createRoute } from "/imports/api/s3-uploads/server/router";
import Clients from "/imports/api/clients/collection";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import Settings from "/imports/api/settings/collection.js";
import fs from "fs";
import FoldersEnum from "/imports/api/business";

createRoute(
  "/uploads/logo/:clientId/:token",
  ({ user, clientId, error, filenames, success, uploadLocal }) => {
    if (!user) {
      return error("Not Authorized");
    }

    if (filenames.length != 1) {
      return error("Invalid number of files");
    }
    const [uploadId] = uploadLocal({ clientId });
    const logo = Uploads.findOne({ _id: uploadId });
    const { path } = logo;

    const { rootFolder } = Settings.findOne({
      rootFolder: { $ne: null }
    });

    let movePath = rootFolder + FoldersEnum.CLIENTS_FOLDER + path;
    fs.renameSync(rootFolder + path, movePath);

    Clients.update(
      { _id: clientId },
      {
        $set: {
          logoPath: path
        }
      }
    );
    success(uploadId);
  }
);
