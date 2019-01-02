import WorkQueues from "/imports/api/workQueues/collection.js";
import Users from "/imports/api/users/collection.js";

export default class WorkQueueService {
  static createWorkQueue({ data, _id }) {
    console.log(data);
    const workQueueId = WorkQueues.insert(data);
    if (_id) {
      this.addWorkQueueToUser({ _id, workQueueId });
    }
    return workQueueId;
  }

  static addWorkQueueToUser({ _id, workQueueId }) {
    console.log(workQueueId);
    Users.update({ _id }, { $push: { workQueueIds: workQueueId } });
  }
}
