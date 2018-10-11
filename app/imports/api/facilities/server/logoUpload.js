import { createRoute } from "/imports/api/uploads/server/router";
import Facilities from "../../facilities/collection";
import Uploads from "/imports/api/uploads/uploads/collection";
import Security from "/imports/api/security/security.js";
import fs from "fs";
import Business from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

createRoute(
  "/uploads/facility-logo/:facilityId/:token",
  ({ user, facilityId, error, filenames, success, uploadLocal }) => {
    if (!user) {
      return error("Not logged in!");
    }
    Security.isAdminOrTech(user._id);

    if (filenames.length != 1) {
      return error("Invalid number of files");
    }

    const [uploadId] = uploadLocal({});

    const { root } = SettingsService.getSettings(settings.ROOT);

    const { path } = Uploads.findOne({
      _id: uploadId
    });

    const movePath = root + Business.CLIENTS_FOLDER + path;
    fs.renameSync(root + path, movePath);

    Facilities.update(
      {
        _id: facilityId
      },
      {
        $set: {
          logoPath: path
        }
      }
    );

    success();
  }
);
