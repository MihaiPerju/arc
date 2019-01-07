import { createRoute } from "/imports/api/uploads/server/router";
import os from "os";
import fs from "fs";
import JobQueue from "/imports/api/jobQueue/collection";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Business from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";
import bulkType from "/imports/api/bulk/enums/pages";

createRoute(
  "/uploads/assignBulkUpload/:token",
  ({ user, error, filenames, postData, success }) => {
    if (filenames.length != 1) {
      return error("Invalid number of files");
    }

    if (postData.assignType) {
      const { root } = SettingsService.getSettings(settings.ROOT);

      let fileName = filenames[0].replace(os.tmpdir() + "/", "");

      fs.renameSync(filenames[0], root + Business.ACCOUNTS_FOLDER + fileName);
      

       let job = null;
      switch (postData.assignType) {
        case (bulkType.ASSIGN_USER):
          job = {
            type: jobTypes.BULK_UPLOAD,
            status: jobStatuses.NEW,
            filePath: fileName,
            userId: user._id,
            assignType: postData.assignType,
            facilityType: postData.facilityType,
            userType: postData.userType
          };
          break;
        case (bulkType.ASSIGN_WORKQUEUE):
          job = {
            type: jobTypes.BULK_UPLOAD,
            status: jobStatuses.NEW,
            filePath: fileName,
            userId: user._id,
            workQueueId: postData.workQueueId,
            assignType: postData.assignType,
          };
          break;
        case (bulkType.ASSIGN_ACTION):
          job = {
            type: jobTypes.BULK_UPLOAD,
            status: jobStatuses.NEW,
            filePath: fileName,
            userId: user._id,
            clientId: postData.clientId,
            actionId: postData.actionId,
            assignType: postData.assignType
          };
          break;
        default:
          job = null;
      }
      if(postData.assignType == bulkType.ASSIGN_ACTION && postData.reasonCodes) { job.reasonCodes = postData.reasonCodes }
      if(postData.assignType == bulkType.ASSIGN_ACTION && postData.customFields) { job.customFields = JSON.parse(postData.customFields) }
    
      job != null && JobQueue.insert(job); 

      success();
    }
  }
);