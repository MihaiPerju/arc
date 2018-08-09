import Papa from "papaparse";
import fs from "fs";
import ParseService from "/imports/api/facilities/server/services/CsvParseService";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import AccountActions from "/imports/api/accountActions/collection";
import JobQueue from "/imports/api/jobQueue/collection";
import fileTypes from "/imports/api/files/enums/fileTypes";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import PaymentsService from "/imports/api/facilities/server/services/PaymentService";
import Facilities from "/imports/api/facilities/collection";

export default class PaymentService {
  static run() {
    //Look for an untaken job
    const job = JobQueue.findOne({
      workerId: null,
      fileType: fileTypes.PAYMENT
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
      this.processPayment(job);
    }
  }

  static processPayment({ facilityId, filePath, userId, _id }) {
    const { rootFolder } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });
    const importRules = ParseService.getImportRules(facilityId, "paymentRules");

    //Parsing and getting the CSV like a string
    const stream = fs.readFileSync(
      rootFolder + Business.ACCOUNTS_FOLDER + filePath
    );
    const csvString = stream.toString();

    const { clientId } = Facilities.findOne({
      _id: facilityId
    });

    const fileData = {
      type: actionTypesEnum.FILE,
      createdAt: new Date(),
      fileName: filePath,
      userId,
      clientId,
      filetype: fileTypes.PAYMENT
    };

    Papa.parse(csvString, {
      chunk: results => {
        PaymentsService.upload(results.data, importRules, facilityId);
        this.createFileAction(results.data, fileData);
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

  static createFileAction(records, fileData) {
    let numberOfRecords = records.length;
    const lastElement = records[numberOfRecords - 1];
    if (lastElement.length < 2) {
      records.pop();
      numberOfRecords = records.length;
    }
    Object.assign(fileData, { numberOfRecords });
    AccountActions.insert(fileData);
  }
}
