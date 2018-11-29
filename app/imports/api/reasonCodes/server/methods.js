import ReasonCodes from "../collection.js";
import Security from "/imports/api/security/security.js";
import CodesService from "/imports/api/reasonCodes/server/services/ReasonCodeService";

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
    CodesService.secure(filters, this.userId);
    return CodesService.getReasonCodes(filters);
  }
});
