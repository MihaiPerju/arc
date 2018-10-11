import { createRoute } from "/imports/api/uploads/server/router";
import fs from "fs";
import os from "os";
import JobQueue from "/imports/api/jobQueue/collection";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Business from "/imports/api/business";
import fileTypes from "/imports/api/files/enums/fileTypes";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

createRoute(
  "/uploads/inventory/:facilityId/:token",
  ({ user, facilityId, error, filenames, success }) => {
    if (filenames.length != 1) {
      return error("Invalid number of files");
    }

    const { root } = SettingsService.getSettings(settings.ROOT);

    let fileName = filenames[0].replace(os.tmpdir() + "/", "");

    fs.renameSync(filenames[0], root + Business.ACCOUNTS_FOLDER + fileName);

    const job = {
      type: jobTypes.IMPORT_DATA,
      status: jobStatuses.NEW,
      filePath: fileName,
      facilityId,
      fileType: fileTypes.INVENTORY,
      userId: user._id
    };

    JobQueue.insert(job);

    success();
  }
);
