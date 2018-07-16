import JobQueue from "/imports/api/jobQueue/collection";
import Reports from "/imports/api/reports/collection";
import { EJSON } from "meteor/ejson";
import fs from "fs";
import os from "os";
import FoldersEnum from "/imports/api/business.js";
import StatusEnum from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Accounts from "/imports/api/accounts/collection";
import stringify from "csv-stringify";
import Headers from "/imports/api/reports/enums/Headers";
import NotificationService from "../api/notifications/server/services/NotificationService";
import ReportColumns from "/imports/api/reportColumns/collection.js";

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

    //   //Create & Save .csv file
      this.saveReport(job);
    }
  }

  static checkFolder(pathToSave) {
    if (!fs.existsSync(pathToSave)) {
      fs.mkdirSync(pathToSave);
    }
  }

  static getFilters(reportId) {
    const { mongoFilters } = Reports.findOne({ _id: reportId });
    return EJSON.parse(mongoFilters);
  }

  static getColumns(reportId) {
    const {authorId} =Reports.findOne({_id: reportId})
    const data = ReportColumns.findOne({userId:authorId});
    const columns = {};

    _.map(data, (value, key) => {
      if (value && key !== "insurances" && key !== "_id" && key !== "userId") {
        columns[key] = Headers[key] ? Headers[key].label : "";
      }
    });

    data.insurances.map((ins, i) => {
      _.map(ins, (value, key) => {
        if (value) {
          columns[`insurances[${i}].${key}`] = Headers[key]
            ? `${Headers[key].label} ${i + 1}`
            : "";
        }
      });
    });
    return columns;
  }

  static saveReport({ reportId, _id }) {
    //Path to new file
    const pathToSave =
      os.tmpdir() + FoldersEnum.APP_FOLDER + FoldersEnum.REPORTS_FOLDER;
    //Check and see if folder for saving is missing
    this.checkFolder(pathToSave);

    const filePath = pathToSave + "/" + reportId + ".csv";
    const file = fs.createWriteStream(filePath);

    //Getting filters
    const filters = this.getFilters(reportId);

    //Write file
    const AccountsNative = Accounts.rawCollection();

    let columns = this.getColumns(reportId);

    const stringifier = stringify({
      columns,
      header: true,
      delimiter: ","
    });

    //Catching
    // stringifier.on("error", function(err) {});

    stringifier.on(
      "finish",
      Meteor.bindEnvironment(() => {
        const { reportId } = JobQueue.findOne({ _id });
        const { authorId } = Reports.findOne({ _id: reportId });
        JobQueue.update(
          { _id },
          {
            $set: {
              status: StatusEnum.FINISHED
            }
          }
        );
        NotificationService.createReportNotification(authorId, reportId);
        NotificationService.createGlobal(authorId)
      })
    );

    AccountsNative.find(filters)
      .pipe(stringifier)
      .pipe(file);
  }
}
