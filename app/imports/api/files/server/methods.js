import Files from "/imports/api/files/collection.js";
import RevertService from "../services/RevertService";
import UploadStatuses from "/imports/api/files/enums/statuses";
import JobQueue from "../../jobQueue/collection";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import Settings from "../../settings/collection";
import settings from "/imports/api/settings/enums/settings";
import fs from "fs";
import Business from "/imports/api/business";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";

Meteor.methods({
  "files.get"(params) {
    const queryParams = QueryBuilder.getFilesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    return Files.find(filters, options).fetch();
  },
  "files.count"(params) {
    const queryParams = QueryBuilder.getFilesParams(params);
    let filters = queryParams.filters;
    return Files.find(filters).count();
  },
  "file.rollback"(_id) {
    RevertService.revert(_id);
    //Need to perform the rest of the logic here, including getting backups and so on.
  },

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
    if (fs.existsSync(root + Business.ACCOUNTS_FOLDER + filePath)) {
      const job = JobQueue.findOne({ filePath });
      //Remove unnecessary data
      delete job.workerId;
      delete job._id;
      delete job.status;
      delete job.status;
      job.fileId = fileId;
      (job.type = jobTypes.RETRY_UPLOAD), JobQueue.insert(job);
    } else {
      return "FILE_NOT_AVAILABLE";
    }
  }
});
