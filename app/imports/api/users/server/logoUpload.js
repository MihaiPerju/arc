import { createRoute } from "/imports/api/uploads/server/router";
import Clients from "/imports/api/clients/collection";
import Uploads from "/imports/api/uploads/uploads/collection";
import fs from "fs";
import FoldersEnum from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

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

    const { root } = SettingsService.getSettings(settings.ROOT);

    let movePath = root + FoldersEnum.CLIENTS_FOLDER + path;
    fs.renameSync(root + path, movePath);

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
