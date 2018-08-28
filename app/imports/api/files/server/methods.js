import Files from "/imports/api/files/collection.js";
import RevertService from "../services/RevertService";
import UploadStatuses from "/imports/api/files/enums/statuses";
import FileTypes from "/imports/api/files/enums/fileTypes";
import FileService from "./services/FileService";
import Facilities from "/imports/api/facilities/collection";
import JobQueue from "../../jobQueue/collection";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";

Meteor.methods({
  "file.rollback"(_id) {
    RevertService.revert(_id);
    Files.remove({ _id });

    //Need to perform the rest of the logic here, including getting backups and so on.
  },

  "file.dismiss"(_id) {
    Files.update({ _id }, { $set: { status: UploadStatuses.DISMISS } });
  },

  "file.getHeader"(_id) {
    const { header } = Files.findOne({ _id });
    return header;
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
    const job = JobQueue.findOne({ filePath });

    //Remove unnecessary data
    delete job.workerId;
    delete job._id;
    delete job.status;
    delete job.status;
    job.fileId = fileId;
    (job.type = jobTypes.RETRY_UPLOAD), JobQueue.insert(job);
  }
});
