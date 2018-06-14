import Notifications from "../collection.js";
import Users from "/imports/api/users/collection.js";

Meteor.methods({
  "notification.create"(data) {
    Notifications.insert(data);
  },
  "notification.remove"(_id) {
    Notifications.remove({ _id });
  }
});
