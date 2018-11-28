import Reports from "./../collection.js";
import Security from "/imports/api/reports/security.js";
import Cronjob from "/imports/api/reports/server/services/CronjobService";
import reportColumnSchema from "../schemas/reportColumnSchema";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";

Meteor.methods({
  "reports.get"(params) {
    const queryParams = QueryBuilder.getReportsParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    options.fields = { name: 1, tagIds: 1 };
    return Reports.find(filters, options).fetch();
  },

  "reports.count"(params) {
    const queryParams = QueryBuilder.getReportsParams(params);
    let filters = queryParams.filters;
    return Reports.find(filters).count();
  },

  "report.getOne"(_id) {
    return Reports.findOne(_id);
  },

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
    const reportColumns = reportColumnSchema.clean(data);

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
  }
});
