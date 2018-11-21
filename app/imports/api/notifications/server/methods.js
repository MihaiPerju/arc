import Notifications from "../collection.js";

Meteor.methods({
  "notification.create"(data) {
    Notifications.insert(data);
  },
  "notification.remove"(_id) {
    Notifications.remove({ _id });
  },
  "notification.setAsSeen"(_id) {
    Notifications.update(
      { _id },
      {
        $set: { seen: true }
      }
    );
  },

  "notifications.get"() {
    let filter = { 'seen': false };
    return Notifications.find(filter).fetch();
  }, 

});
