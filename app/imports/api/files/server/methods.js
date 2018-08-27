import Files from "/imports/api/files/collection.js";
import RevertService from "../services/RevertService";
import UploadStatuses from "/imports/api/files/enums/statuses";
import FileTypes from "/imports/api/files/enums/fileTypes";
import FileService from "./services/FileService";
import Facilities from "/imports/api/facilities/collection";
import JobQueue from "../../jobQueue/collection";

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
    console.log(_id);
    const { type, fileName, header } = Files.findOne({ _id });
    if (type === FileTypes.INVENTORY) {
      return "Inventory";
    } else {
      return header;
    }
  },

  "file.updateHeader"(_id, header) {
    console.log(_id);
    console.log(header);
    Files.update(
      { _id },
      {
        $set: { header }
      }
    );
  },

  "file.retryUpload"(filePath, fileId) {
    console.log(filePath);
    const job = JobQueue.findOne({ filePath });

    //Remove unnecessary data
    delete job.workerId;
    delete job._id;
    delete job.status;
    job.userId = this.userId;
    job.fileId = fileId;

    JobQueue.insert(job);
  }
});
