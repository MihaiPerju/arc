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
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

export default class PlacementService {
  static run() {
    //Look for an untaken job
    const job = JobQueue.findOne({
      workerId: null,
      fileType: fileTypes.PLACEMENT,
      type: jobTypes.IMPORT_DATA
    });
    if (job) {
      //Update the job as taken
      JobQueue.update({
        _id: job._id
      }, {
        $set: {
          workerId
        }
      });
      this.processPlacement(job);
    }
  }

  static processPlacement({
    facilityId,
    filePath,
    userId,
    _id
  }) {
    const {
      root
    } = SettingsService.getSettings(settings.ROOT);

    const importRules = ParseService.getImportRules(
      facilityId,
      "placementRules"
    );

    //Parsing and getting the CSV like a string
    const stream = fs.readFileSync(
      root + Business.ACCOUNTS_FOLDER + filePath
    );
    const csvString = stream.toString();
    console.log(csvString);
    
    //Keep reference to previous file
    const {
      fileId,
      clientId,
      placementRules,
      allowedUsers
    } = Facilities.findOne({
      _id: facilityId
    });

    if (!placementRules) {
      throw new Meteor.Error(
        "The Facility Doesn't Have Configured Importing Rules"
      );
    }

    const newFileId = Files.insert({
      fileName: filePath,
      facilityId,
      clientId,
      previousFileId: fileId,
      type: fileTypes.PLACEMENT,
      hasHeader: placementRules.hasHeader
    });

    const fileData = {
      type: actionTypesEnum.FILE,
      createdAt: new Date(),
      fileId: newFileId,
      fileName: filePath,
      userId,
      clientId,
      filetype: fileTypes.PLACEMENT
    };

    //Add reference to facility
    Facilities.update({
      _id: facilityId
    }, {
      $set: {
        fileId: newFileId
      }
    });

    //Pass links to accounts to link them too
    const links = {
      facilityId,
      fileId: newFileId,
      managerIds: allowedUsers
    };

    Papa.parse(csvString, {
      chunk: results => {
        AccountService.upload(results.data, importRules, links);
        this.createFileAction(results.data, fileData);
      },
      complete: () => {
        JobQueue.update({
          _id
        }, {
          $set: {
            status: jobStatuses.FINISHED
          }
        });
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
    Object.assign(fileData, {
      numberOfRecords
    });
    AccountActions.insert(fileData);
  }
}