import Files from "/imports/api/files/collection.js";
import UploadStatuses from "/imports/api/files/enums/statuses";
import JobQueue from "../../jobQueue/collection";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import Settings from "../../settings/collection";
import settings from "/imports/api/settings/enums/settings";
import fs from "fs";
import Business from "/imports/api/business";

Meteor.methods({
  "file.dismiss"(_id) {
    Files.update({ _id }, { $set: { status: UploadStatuses.DISMISS } });
  },

  "file.getHeader"(_id) {
    const { header, hasHeader } = Files.findOne({ _id });
    if (hasHeader) {
      return header;
    }
  },

  "file.updateHeader"(_id, header) {
    Files.update(
      { _id },
      {
        $set: { header }
      }
    );
  },

  "file.retryUpload"(filePath, fileId) {
    const { root } = Settings.findOne({ name: settings.ROOT });
    //Check the file is exist or not.
    if( fs.existsSync(root + Business.ACCOUNTS_FOLDER + filePath) ) {
      const job = JobQueue.findOne({ filePath });
      //Remove unnecessary data
      delete job.workerId;
      delete job._id;
      delete job.status;
      delete job.status;
      job.fileId = fileId;
      (job.type = jobTypes.RETRY_UPLOAD), JobQueue.insert(job);
    }else{
      return 'FILE_NOT_AVAILABLE';
    }
  },
});
