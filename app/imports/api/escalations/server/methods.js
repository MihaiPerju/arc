import Escalations from "../collection";
import RolesEnum from "/imports/api/users/enums/roles";
import NotificationService from "/imports/api/notifications/server/services/NotificationService";

Meteor.methods({
  "escalation.get"(_id) {
    return Escalations.findOne({ _id });
  },
  "escalation.addMessage"(message, escalationId, accountId) {
    let open = Roles.userIsInRole(this.userId, RolesEnum.REP) ? true : false;
    const { authorId } = Escalations.findOne({ _id: escalationId });

    Escalations.update(
      { _id: escalationId },
      { $push: { messages: message }, $set: { open } }
    );
    //If is a respond from messenger, emit global notification for the user.
    if (!open) {
      NotificationService.createGlobal(authorId);
    }

    NotificationService.createRespondToEscalation(authorId, accountId);
  }
});
