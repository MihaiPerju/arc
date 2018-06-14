import Escalations from "../collection";
import RolesEnum from "/imports/api/users/enums/roles";

Meteor.methods({
  "escalation.get"(_id) {
    return Escalations.findOne({ _id });
  },
  "escalation.addMessage"(message, escalationId) {
    let open = Roles.userIsInRole(this.userId, RolesEnum.REP) ? true : false;
    Escalations.update(
      { _id: escalationId },
      { $push: { messages: message }, $set: { open } }
    );
  }
});
