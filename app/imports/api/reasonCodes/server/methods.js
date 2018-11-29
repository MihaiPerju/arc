import ReasonCodes from "../collection.js";
import Security from "/imports/api/security/security.js";
import CodesService from "/imports/api/reasonCodes/server/services/ReasonCodeService";
import RolesEnum from "/imports/api/users/enums/roles";

Meteor.methods({
  "reasonCode.create"(data) {
    Security.checkLoggedIn(this.userId);
    if (!data.managerId) {
      Security.isAdminOrTech(this.userId);
    }
    return ReasonCodes.insert(data);
  },

  "reasonCode.edit"(data) {
    Security.checkLoggedIn(this.userId);

    return ReasonCodes.update(
      { _id: data._id },
      {
        $set: data
      }
    );
  },

  "reasonCode.delete"(_id) {
    Security.checkLoggedIn(this.userId);

    return ReasonCodes.remove({ _id });
  },

  "reasonCodes.get"(filters = {}) {
    if (Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
      _.extend(filters, {
        $or: [{ managerId: this.userId }, { managerId: null }]
      });
    } else if (Roles.userIsInRole(this.userId, RolesEnum.REP)) {
      _.extend(filters, {
        $or: [{ clientId: { $exists: true } }, { managerId: null }]
      });
    } else {
      // for admin and tech
      _.extend(filters, {
        managerId: null
      });
    }

    return CodesService.getReasonCodes(filters);
  }
});
