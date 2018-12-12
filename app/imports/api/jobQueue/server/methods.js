import JobQueue from "./../collection";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";

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
  },

  "bulkActionRequestQueue.get"(clientId, userId) {
    let filter = { 'status': jobStatuses.NEW, 'type': jobTypes.BULK_UPLOAD };

    if (clientId && clientId != '-1')
      filter['clientId'] = clientId;

    if (userId && userId != '-1')
      filter['userId'] = userId;
      
    return JobQueue.find(filter).fetch();
  },
});
