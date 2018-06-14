import Reports from "/imports/api/reports/collection.js";
import UserRoles from "/imports/api/users/enums/roles";

export default {
  hasRightsOnReport(userId, _id) {
    const report = Reports.findOne({ _id });
    if (
      !(report.shareReport && Roles.userIsInRole(userId, UserRoles.ADMIN)) &&
      userId !== report.authorId
    ) {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  }
};
