import Accounts from "../collection";
import { createRoute } from "/imports/api/uploads/server/router";
import Uploads from "/imports/api/uploads/uploads/collection";
import Business from "/imports/api/business";
import * as Path from "path";
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
    const { name, path } = Uploads.findOne({ _id: uploadId });
    const movePath = Path.join(root, Business.ACCOUNTS_FOLDER, accountId, name);

    fs.renameSync(path, movePath);

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
