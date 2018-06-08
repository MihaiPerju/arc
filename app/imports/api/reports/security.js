import Reports from "/imports/api/reports/collection.js";
import { roleGroups } from "/imports/api/users/enums/roles";

export default {
  hasDeleteRightsOnReport(userId, _id) {
    const report = Reports.findOne({ _id });
    if (
      !Roles.userIsInRole(userId, roleGroups.ADMIN_TECH_MANAGER) ||
      (!report.shareReport && userId !== report.createdBy)
    ) {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },
  hasRightsOnReport(userId, _id) {
    const report = Reports.findOne({ _id });
    if (
      !Roles.userIsInRole(userId, roleGroups.ADMIN_TECH_MANAGER) ||
      (userId !== report.createdBy)
    ) {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  }
};
