import Reports from "./../collection.js";
import Security from "/imports/api/reports/security.js";
import Cronjob from "/imports/api/reports/server/services/CronjobService";
import reportColumnSchema from "../schemas/reportColumnSchema";
import Accounts from "/imports/api/accounts/collection";
import { EJSON } from "meteor/ejson";

Meteor.methods({
  "report.delete"(id) {
    Security.hasRightsOnReport(this.userId, id);
    Reports.remove({ _id: id });
  },

  "report.deleteMany"(Ids) {
    _.each(Ids, id => {
      Meteor.call("report.delete", id);
    });
  },

  "report.create"(data) {
    data.authorId = this.userId;

    const reportColumns = reportColumnSchema.clean({});
    _.extend(data, {
      reportColumns
    });
    Reports.insert(data);
  },

  "report.getById"(_id) {
    Security.hasRightsOnReport(this.userId, _id);

    return Reports.findOne({ _id });
  },

  "report.update"(data) {
    // Check if user is allowed to modify report;
    Security.hasRightsOnReport(this.userId, data._id);

    return Reports.update(
      { _id: data._id },
      {
        $set: data.generalInformation
      }
    );
  },

  "report.sendNow"(schedule) {
    Security.hasRightsOnReport(this.userId, schedule.reportId);

    Cronjob.executeSchedule(schedule);
  },

  "report.copy"(_id) {
    const report = Reports.findOne({ _id });
    if (report) {
      report.authorId = this.userId;
      delete report._id;
      Reports.insert(report);
    }
  },

  "report.updateColumns"(_id, name, data) {
    Security.hasRightsOnReport(this.userId, _id);
    const { metaData } = data;
    const reportColumns = reportColumnSchema.clean(data);
    Object.assign(reportColumns, { metaData });

    Reports.update(
      { _id, name },
      {
        $set: { reportColumns }
      }
    );
  },

  "report.tag"({ _id, tagIds }) {
    Reports.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  },

  "report.getMetaDataColumns"(mongoFilters) {
    const filters = EJSON.parse(mongoFilters);
    const metaDataArr = Accounts.find(filters, {
      fields: { metaData: 1, _id: 0 }
    }).fetch();

    const metaDataColumn = { hasHeader: [], noHeader: [] };
    metaDataArr.map(accountMetaData => {
      _.map(accountMetaData["metaData"], (value, key) => {
        if (key.indexOf("Column#") === -1) {
          metaDataColumn["hasHeader"].push(key);
        } else {
          metaDataColumn["noHeader"].push(key);
        }
      });
    });

    metaDataColumn["hasHeader"] = Array.from(
      new Set(metaDataColumn["hasHeader"])
    );
    metaDataColumn["noHeader"] = Array.from(
      new Set(metaDataColumn["noHeader"])
    );
    return metaDataColumn;
  }
});
