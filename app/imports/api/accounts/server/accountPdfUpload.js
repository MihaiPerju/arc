import Accounts from "../collection";
import { createRoute } from "/imports/api/uploads/server/router";
import Uploads from "/imports/api/uploads/uploads/collection";
import Business from "/imports/api/business";
import fs from "fs";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

createRoute(
  "/uploads/account-pdf/:accountId/:token",
  ({ user, accountId, error, filenames, success, uploadLocal }) => {
    if (!user) {
      return error("Not logged in!");
    }

    if (filenames.length != 1) {
      return error("Invalid number of files");
    }

    const { root } = SettingsService.getSettings(settings.ROOT);

    const [uploadId] = uploadLocal({ accountId });
    const { path } = Uploads.findOne({ _id: uploadId });
    const movePath = root + Business.ACCOUNTS_FOLDER + accountId + "/" + path;
    fs.renameSync(root + path, movePath);

    Accounts.update(
      { _id: accountId },
      {
        $push: {
          attachmentIds: uploadId
        }
      }
    );
    success();
  }
);
