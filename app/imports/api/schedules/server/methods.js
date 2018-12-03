import Schedules from "/imports/api/schedules/collection.js";

Meteor.methods({
  "schedule.create"(data) {
    Schedules.insert(data);
  },

  "schedule.delete"(_id) {
    Schedules.remove({ _id });
  },

  "schedules.get"(filters) {
    return Schedules.find(filters).fetch();
  }
});
