import JobQueue from "../api/jobQueue/collection";
import Reports from "/imports/api/reports/collection";
import { EJSON } from "meteor/ejson";
import fs from "fs";
import os from "os";
import FoldersEnum from "/imports/api/business.js";
import StatusEnum from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Accounts from "/imports/api/tasks/collection";

export default class RunReports {
  static run() {
    const job = JobQueue.findOne({ workerId: null });
    if (job) {
      //Mark job as taken
      JobQueue.update(
        { _id: job._id },
        {
          $set: {
            workerId
          }
        }
      );
      //Getting accounts
      const accounts = this.getAccounts(job);
      //Create & Save .csv file
      this.saveReport(accounts, job);
    }
  }

  static getAccounts({ reportId, _id }) {
    //Getting filters
    const { mongoFilters, name } = Reports.findOne();
    const filters = EJSON.parse(mongoFilters);

    //Getting accounts
    return Accounts.find(filters).fetch();
  }

  static saveReport(accounts, { reportId, _id }) {
    // See if report folder exists
    const pathToSave =
      os.tmpdir() +
      FoldersEnum.APP_FOLDER +
      FoldersEnum.REPORTS_FOLDER +
      "/" +
      reportId;

    if (!fs.existsSync(pathToSave)) {
      // Create path for report folder
      fs.mkdirSync(pathToSave);
    }

    ///////////////////////////
    //Sample to create CSV File
    const rows = [
      ["name1", "city1", "some other info"],
      ["name2", "city2", "more info"]
    ];
    let csvContent = "";
    rows.forEach(function(rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });
    ////////////////////////////

    //Path to save
    const filePath = pathToSave + "/" + _id + ".csv";
    //Write file
    try {
      fs.writeFileSync(filePath, csvContent);
      //Update job queue
      JobQueue.update(
        { _id },
        {
          $set: {
            status: StatusEnum.FINISHED
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}
