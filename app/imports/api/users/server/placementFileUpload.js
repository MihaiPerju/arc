import { createRoute } from "/imports/api/uploads/server/router";
import os from "os";
import fs from "fs";
import JobQueue from "/imports/api/jobQueue/collection";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Business from "/imports/api/business";
import fileTypes from "/imports/api/files/enums/fileTypes";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

createRoute(
  "/uploads/csv/:facilityId/:token",
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
      fileType: fileTypes.PLACEMENT,
      userId: user._id
    };

    JobQueue.insert(job);

    success();
  }
);
