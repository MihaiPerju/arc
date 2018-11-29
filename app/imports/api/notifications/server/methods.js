import Notifications from "../collection.js";

Meteor.methods({
  "notification.create"(data) {
    Notifications.insert(data);
  },

  "notification.remove"(_id) {
    Notifications.remove({ _id });
  },

  "notifications.get"(filters) {
    let options = { sort: { createdAt: -1 } };
    return Notifications.find(filters, options).fetch();
  },

  "notification.setAsSeen"(_id) {
    Notifications.update(
      { _id },
      {
        $set: { seen: true }
      }
    );
  }
});
