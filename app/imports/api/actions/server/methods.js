import Actions from "/imports/api/actions/collection.js";
import ActionService from "./services/ActionService";
import FlagService from "./services/FlagService";

Meteor.methods({
  "action.create"(data) {
    ActionService.createAction(data);
  },

  "action.edit"(id, { title, description, substateId, inputs }) {
    ActionService.editAction({
      _id: id,
      title,
      description,
      substateId,
      inputs
    });
  },

  "action.delete"(actionId) {
    Actions.remove({ _id: actionId });
  },

  "action.deleteMany"(Ids) {
    _.each(Ids, _id => {
      Actions.remove({ _id });
    });
  },

  "action.flag.create"(data) {
    data.userId = this.userId;
    FlagService.createFlag(data);
  },

  "action.flag.respond"(data) {
    data.userId = this.userId;
    FlagService.respondToFlag(data);
  }
});
