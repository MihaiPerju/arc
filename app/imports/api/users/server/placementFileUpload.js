import {
  createRoute
} from "/imports/api/s3-uploads/server/router";
import os from "os";
import fs from "fs";
import JobQueue from '/imports/api/jobQueue/collection';
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Settings from "/imports/api/settings/collection";
import Business from "/imports/api/business";
import fileTypes from "/imports/api/files/enums/fileTypes";

createRoute(
  "/uploads/csv/:facilityId/:token",
  ({
    user,
    facilityId,
    error,
    filenames,
    success
  }) => {
    if (filenames.length != 1) {
      return error("Invalid number of files");
    }
    const {
      rootFolder
    } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });
    let fileName = filenames[0].replace(os.tmpdir() + "/", "");

    fs.renameSync(filenames[0], rootFolder + Business.ACCOUNTS_FOLDER + fileName);

    const job = {
      type: jobTypes.IMPORT_PLACEMENT,
      status: jobStatuses.NEW,
      filePath: fileName,
      facilityId,
      fileType: fileTypes.PLACEMENT,
      userId: user._id
    }

    JobQueue.insert(job);

    success();
  }
);