import Papa from "papaparse";
import fs from "fs";
import AccountService from "/imports/api/facilities/server/services/AccountImportingService";
import ParseService from "/imports/api/facilities/server/services/CsvParseService";
import Files from "/imports/api/files/collection";
import os from "os";
import Facilities from "/imports/api/facilities/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import AccountActions from "/imports/api/accountActions/collection";
import JobQueue from "/imports/api/jobQueue/collection";
import fileTypes from "/imports/api/files/enums/fileTypes";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

export default class ReuploadService {
  static run() {
    //Look for an untaken job
    const job = JobQueue.findOne({
      workerId: null,
      status: jobStatuses.REUPLOAD
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
      this.reuploadFile(job);
    }
  }

  static reuploadFile(job) {
    const { facilityId, filePath, userId, _id } = job;
    const previousFileId = job.fileId;

    const { rootFolder } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });

    const importRules = ParseService.getImportRules(
      facilityId,
      "placementRules"
    );

    //Parsing and getting the CSV like a string
    const stream = fs.readFileSync(
      rootFolder + Business.ACCOUNTS_FOLDER + filePath
    );
    const csvString = stream.toString();

    //Keep reference to previous file
    const { fileId, clientId } = Facilities.findOne({
      _id: facilityId
    });

    const fileData = {
      type: actionTypesEnum.FILE,
      createdAt: new Date(),
      fileId,
      fileName: filePath,
      userId,
      clientId,
      filetype: fileTypes.PLACEMENT
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
      fileId: fileId
    };

    Papa.parse(csvString, {
      chunk: results => {
        AccountService.upload(results.data, importRules, links);
        this.reuploadAction(results.data, fileData);
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

  static reuploadAction(records, fileData) {
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
