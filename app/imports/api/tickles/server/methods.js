import Tickles from "../collection.js";

Meteor.methods({
  "tickle.get"(filters = {}) {
    return Tickles.findOne(filters);
  }
});
