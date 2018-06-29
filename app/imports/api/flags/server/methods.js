import FlagService from "./services/FlagService";

Meteor.methods({
  "flag.create"(data) {
    data.authorId = this.userId;
    FlagService.createFlag(data);
  },

  "flag.respond"(data) {
    data.managerId = this.userId;
    FlagService.respondToFlag(data);
  }
});
