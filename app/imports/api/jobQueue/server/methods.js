import JobQueue from "./../collection";

Meteor.methods({
  "jobQueue.create"(data) {
    JobQueue.insert(data);
  }
});
