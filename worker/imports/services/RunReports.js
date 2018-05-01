import JobQueue from "/imports/api/jobQueue/collection";
import Reports from "/imports/api/reports/collection";
import { EJSON } from "meteor/ejson";
import fs from "fs";
import os from "os";
import FoldersEnum from "/imports/api/business.js";
import StatusEnum from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Accounts from "/imports/api/tasks/collection";
import stringify from "csv-stringify";
import Headers from "/imports/api/reports/enums/Headers";

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

      //Create & Save .csv file
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
    return {
      acctNum: Headers.acctNum.label,
      fbDate: Headers.fbDate.label,
      ptType: Headers.ptType.label,
      ptName: Headers.ptName.label,
      dischrgDate: Headers.dischrgDate.label,
      fbDate: Headers.fbDate.label,
      acctBal: Headers.acctBal.label,
      finClass: Headers.finClass.label,
      admitDate: Headers.admitDate.label,
      medNo: Headers.medNo.label,
      "insurances[0].insName": Headers.insName.label + " 1",
      "insurances[0].insCode": Headers.insCode.label + " 1",
      "insurances[0].insBal": Headers.insBal.label + " 1",
      "insurances[0].address1": Headers.address1.label + " 1",
      "insurances[0].address2": Headers.address2.label + " 1",
      "insurances[0].city": Headers.city.label + " 1",
      "insurances[0].state": Headers.state.label + " 1",
      "insurances[0].policy": Headers.policy.label + " 1",
      "insurances[0].zip": Headers.zip.label + " 1",
      "insurances[0].phone": Headers.phone.label + " 1",
      "insurances[1].insName": Headers.insName.label + " 2",
      "insurances[1].insCode": Headers.insCode.label + " 2",
      "insurances[1].insBal": Headers.insBal.label + " 2",
      "insurances[1].address1": Headers.address1.label + " 2",
      "insurances[1].address2": Headers.address2.label + " 2",
      "insurances[1].city": Headers.city.label + " 2",
      "insurances[1].state": Headers.state.label + " 2",
      "insurances[1].policy": Headers.policy.label + " 2",
      "insurances[1].zip": Headers.zip.label + " 2",
      "insurances[1].phone": Headers.phone.label + " 2",
      "insurances[2].insName": Headers.insName.label + " 3",
      "insurances[2].insCode": Headers.insCode.label + " 3",
      "insurances[2].insBal": Headers.insBal.label + " 3",
      "insurances[2].address1": Headers.address1.label + " 3",
      "insurances[2].address2": Headers.address2.label + " 3",
      "insurances[2].city": Headers.city.label + " 3",
      "insurances[2].state": Headers.state.label + " 3",
      "insurances[2].policy": Headers.policy.label + " 3",
      "insurances[2].zip": Headers.zip.label + " 3",
      "insurances[2].phone": Headers.phone.label + " 3",
      "insurances[3].insName": Headers.insName.label + " 4",
      "insurances[3].insCode": Headers.insCode.label + " 4",
      "insurances[3].insBal": Headers.insBal.label + " 4",
      "insurances[3].address1": Headers.address1.label + " 4",
      "insurances[3].address2": Headers.address2.label + " 4",
      "insurances[3].city": Headers.city.label + " 4",
      "insurances[3].state": Headers.state.label + " 4",
      "insurances[3].policy": Headers.policy.label + " 4",
      "insurances[3].zip": Headers.zip.label + " 4",
      "insurances[3].phone": Headers.phone.label + " 4",
    };
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
    // stringifier.on("error", function(err) {
    //   console.log(err.message);
    // });

    stringifier.on(
      "finish",
      Meteor.bindEnvironment(() => {
        JobQueue.update(
          { _id },
          {
            $set: {
              status: StatusEnum.FINISHED
            }
          }
        );
      })
    );

    AccountsNative.find(filters)
      .pipe(stringifier)
      .pipe(file);
  }
}
