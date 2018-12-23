import Reports from "./../collection.js";
import Security from "/imports/api/reports/security.js";
import Cronjob from "/imports/api/reports/server/services/CronjobService";
import reportColumnSchema from "../schemas/reportColumnSchema";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import ReportsService from "./services/ReportsService";
import ActionService from "../../accounts/server/services/ActionService";

Meteor.methods({
  "reports.get"(params) {
    const queryParams = QueryBuilder.getReportsParams(params);
    let filters = queryParams.filters;
    ReportsService.secure(filters, this.userId);
    let options = queryParams.options;
    options.fields = { name: 1, tagIds: 1 };
    return Reports.find(filters, options).fetch();
  },

  "reports.count"(params) {
    const queryParams = QueryBuilder.getReportsParams(params);
    let filters = queryParams.filters;
    ReportsService.secure(filters, this.userId);
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
  },

  async "reports.getbuilt"(authorId, dateRangeFilter) {
    let filter = {};

    if (authorId && authorId != "-1") filter = { authorId: authorId };

    if (dateRangeFilter) filter["createdAt"] = dateRangeFilter;

    let ReportsRaw = Reports.rawCollection();
    ReportsRaw.aggregateSync = Meteor.wrapAsync(ReportsRaw.aggregate);
    return await ReportsRaw.aggregateSync([
      {
        $match: filter
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]).toArray();
  },

  async "reports.getBuiltPerHour"(authorId, dateRangeFilter) {
    const ReportsRaw = Reports.rawCollection();
    ReportsRaw.aggregateSync = Meteor.wrapAsync(ReportsRaw.aggregate);

    let filter = {};

    if (authorId && authorId != "-1") filter = { authorId: authorId };

    if (dateRangeFilter) filter["createdAt"] = dateRangeFilter;

    const builtReportsPerHour = await ReportsRaw.aggregateSync([
      {
        $match: filter
      },
      {
        $group: {
          _id: {
            y: {
              $year: "$createdAt"
            },
            m: {
              $month: "$createdAt"
            },
            d: {
              $dayOfMonth: "$createdAt"
            },
            h: {
              $hour: "$createdAt"
            }
          },
          total: {
            $sum: 1
          }
        }
      }
    ]).toArray();
    return ActionService.graphStandardizeData(builtReportsPerHour);
  },

  async "reports.getGenerated"(dateRangeFilter) {
    let filter = { authorId: this.userId };

    if (dateRangeFilter) filter["createdAt"] = dateRangeFilter;

    let ReportsRaw = Reports.rawCollection();
    ReportsRaw.aggregateSync = Meteor.wrapAsync(ReportsRaw.aggregate);
    return await ReportsRaw.aggregateSync([
      {
        $match: filter
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]).toArray();
  },

  async "reports.getGeneratedPerHour"(dateRangeFilter) {
    const ReportsRaw = Reports.rawCollection();
    ReportsRaw.aggregateSync = Meteor.wrapAsync(ReportsRaw.aggregate);

    let filter = { authorId: this.userId };

    if (dateRangeFilter) filter["createdAt"] = dateRangeFilter;

    const generatedReportsPerHour = await ReportsRaw.aggregateSync([
      {
        $match: filter
      },
      {
        $group: {
          _id: {
            y: {
              $year: "$createdAt"
            },
            m: {
              $month: "$createdAt"
            },
            d: {
              $dayOfMonth: "$createdAt"
            },
            h: {
              $hour: "$createdAt"
            }
          },
          total: {
            $sum: 1
          }
        }
      }
    ]).toArray();
    return ActionService.graphStandardizeData(generatedReportsPerHour);
  },

  async "reports.getSent"(authorId, dateRangeFilter) {
    let filter = {};

    if (authorId && authorId != "-1") filter = { authorId: authorId };

    if (dateRangeFilter) filter["createdAt"] = dateRangeFilter;

    let ReportsRaw = Reports.rawCollection();
    ReportsRaw.aggregateSync = Meteor.wrapAsync(ReportsRaw.aggregate);
    return await ReportsRaw.aggregateSync([
      {
        $match: filter
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]).toArray();
  },

  async "reports.getSentPerHour"(authorId, dateRangeFilter) {
    let filter = {};

    if (authorId && authorId != "-1") filter = { authorId: authorId };

    const ReportsRaw = Reports.rawCollection();
    ReportsRaw.aggregateSync = Meteor.wrapAsync(ReportsRaw.aggregate);

    if (dateRangeFilter) filter["createdAt"] = dateRangeFilter;

    const sentReportsPerHour = await ReportsRaw.aggregateSync([
      {
        $match: filter
      },
      {
        $group: {
          _id: {
            y: {
              $year: "$createdAt"
            },
            m: {
              $month: "$createdAt"
            },
            d: {
              $dayOfMonth: "$createdAt"
            },
            h: {
              $hour: "$createdAt"
            }
          },
          total: {
            $sum: 1
          }
        }
      }
    ]).toArray();
    return ActionService.graphStandardizeData(sentReportsPerHour);
  }
});
