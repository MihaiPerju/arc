import Papa from "papaparse";
import fs from "fs";
import AccountService from "/imports/api/facilities/server/services/AccountImportingService";
import ParseService from "/imports/api/facilities/server/services/CsvParseService";
import Facilities from "/imports/api/facilities/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import AccountActions from "/imports/api/accountActions/collection";
import JobQueue from "/imports/api/jobQueue/collection";
import fileTypes from "/imports/api/files/enums/fileTypes";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

export default class ReuploadService {
  static run() {
    //Look for an untaken job
    const job = JobQueue.findOne({
      workerId: null,
      status: jobStatuses.NEW,
      type: jobTypes.RETRY_UPLOAD
    });
    if (job) {
      // Update the job as taken
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
      this.reuploadFile(job);
      job;
    }
  }
  static reuploadFile({ facilityId, filePath, fileId, fileType, userId, _id }) {
    const { root } = SettingsService.getSettings(settings.ROOT);

    const ruleType = fileType + "Rules";
    const importRules = ParseService.getImportRules(facilityId, ruleType);
    //Parsing and getting the CSV like a string
    const stream = fs.readFileSync(
      root + Business.ACCOUNTS_FOLDER + filePath
    );
    const csvString = stream.toString();

    //Get client Id
    const { clientId } = Facilities.findOne({
      _id: facilityId
    });

    const fileData = {
      type: actionTypesEnum.REUPLOAD,
      createdAt: new Date(),
      fileId,
      fileName: filePath,
      userId,
      clientId,
      fileType
    };

    //Add reference to facility
    Facilities.update(
      {
        _id: facilityId
      },
      {
        $set: {
          fileId
        }
      }
    );

    //Pass links to accounts to link them too
    const links = {
      facilityId,
      fileId
    };

    Papa.parse(csvString, {
      chunk: results => {
        if (fileType === fileTypes.INVENTORY) {
          AccountService.update(results.data, importRules, links);
        } else {
          AccountService.upload(results.data, importRules, links);
        }
        // this.createFileAction(results.data, fileData);
      },
      complete: () => {
        // executed after all files are complete
        JobQueue.update({ _id }, { $set: { status: jobStatuses.FINISHED } });
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
