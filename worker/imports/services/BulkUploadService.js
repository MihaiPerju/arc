import Papa from "papaparse";
import fs from "fs";
import JobQueue from "/imports/api/jobQueue/collection";
import Business from "/imports/api/business";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";
import Accounts from "/imports/api/accounts/collection";
import ActionService from "/imports/api/accounts/server/services/ActionService";
import bulkType from "/imports/api/bulk/enums/pages";

export default class BulkUploadService {
  static run() {
    //Look for an untaken job
    const job = JobQueue.findOne({
      workerId: null,
      type: jobTypes.BULK_UPLOAD
    });
    if (job) {
      //Update the job as taken
        JobQueue.update(
        {
          _id: job._id
        },
        {
          $set: {
            workerId
          }
        }
      );  
      this.processBulkUploadFile(job);
    }
  }

  static processBulkUploadFile(jobData) {
    const { filePath, _id } = jobData;
    const { root } = SettingsService.getSettings(settings.ROOT);

    //Parsing and getting the CSV like a string
    const stream = fs.readFileSync(root + Business.ACCOUNTS_FOLDER + filePath);
    const csvString = stream.toString();

    Papa.parse(csvString, {
      chunk: results => {
        this.updateAssign(results.data, jobData);
      },
      complete: () => {
        JobQueue.update(
          {
            _id
          },
          {
            $set: {
              status: jobStatuses.FINISHED
            }
          }
        );
        // executed after all files are complete
      }
    });
  }

  static updateAssign(excelData, jobData) {
    let data = {};
    excelData.map((value, index) => {
      if (value && value[0]) {
        let acctNum = value[0];
        if (acctNum) {
          let acctData = Accounts.find({ acctNum }).fetch()[0];

          if (acctData) {
            switch (jobData.assignType) {
              case bulkType.ASSIGN_USER:
                Accounts.update(
                  {
                    _id: acctData._id
                  },
                  {
                    $set: {
                      assigneeId: jobData.userType
                    },
                    $unset: {
                      workQueueId: null
                    }
                  }
                );
                break;
              case bulkType.ASSIGN_WORKQUEUE:
                Accounts.update(
                  {
                    _id: acctData._id
                  },
                  {
                    $set: {
                      workQueueId: jobData.workQueueId
                    },
                    $unset: {
                      assigneeId: null
                    }
                  }
                );
                break;
              case bulkType.ASSIGN_ACTION:
                data.actionId = jobData.actionId;
                data.reasonCode = jobData.reasonCodes;
                data.userId = jobData.userId;
                data.accountId = acctData._id;

                if (acctData.assignee) {
                  data.addedBy = `${acctData.assignee.profile.firstName} ${
                    acctData.assignee.profile.lastName
                  }`;
                } else if (acctData.workQueueId && acctData.tag) {
                  data.addedBy = acctData.tag.name;
                }

                if (jobData.customFields)
                  data = { ...data, ...jobData.customFields };

                //checking the client name of the imported account number  
                if(acctData.clientId && acctData.clientId == jobData.clientId){
                  ActionService.createAction(data);
                }
                break;
              default:
                return null;
            }
          }
        }
      }
    });
  }
}
