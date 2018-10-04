import Actions from "/imports/api/actions/collection.js";
import ActionService from "./services/ActionService";
import FlagService from "./services/FlagService";
import Security from "/imports/api/security/security";

Meteor.methods({
  "action.create"(data) {
    Security.isAdminOrTech(this.userId);
    ActionService.createAction(data);
  },

  "action.edit"(id, { title, description, substateId, inputs }) {
    Security.isAdminOrTech(this.userId);
    ActionService.editAction({
      _id: id,
      title,
      description,
      substateId,
      inputs
    });
  },

  "action.delete"(actionId) {
    Security.isAdminOrTech(this.userId);
    Actions.remove({ _id: actionId });
  },

  "action.deleteMany"(ids) {
    Security.isAdminOrTech(this.userId);
    Actions.remove({ _id: { $in: ids } });
  },

  "action.createFlag"(data) {
    data.userId = this.userId;
    FlagService.flagAction(data);
  },

  "action.respondFlag"(data) {
    data.managerId = this.userId;
    FlagService.respondToFlag(data);
  },

  "comment.createFlag"(data) {
    data.userId = this.userId;
    FlagService.flagComment(data);
  },

  "comment.respondFlag"(data) {
    data.managerId = this.userId;
    FlagService.respondToFlag(data);
  },

  "action.tag"({ _id, tagIds }) {
    Actions.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
