import JobQueue from "./../collection";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

Meteor.methods({
  "jobQueue.create"(data) {
    JobQueue.insert(data);
  },

  "jobQueue.assignByUser"(bulkType) {
    return JobQueue.find(
      { assignType: bulkType, status: jobStatuses.NEW },
      { status: 1, workerId: 1 }
    ).fetch();
  },

  "jobQueue.getLastJob"(filters = {}) {
    return JobQueue.findOne(filters, { sort: { createdAt: -1 } });
  },

  "jobQueue.get"(filters = {}) {
    return JobQueue.findOne(filters);
  }
});
