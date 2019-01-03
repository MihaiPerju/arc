import WorkQueues from "/imports/api/workQueues/collection.js";
import Users from "/imports/api/users/collection.js";
import Accounts from "/imports/api/accounts/collection";

export default class WorkQueueService {
  static createWorkQueue({ data, _id }) {
    const workQueueId = WorkQueues.insert(data);
    if (_id) {
      this.addWorkQueueToUser({ _id, workQueueId });
    }
    return workQueueId;
  }

  static addWorkQueueToUser({ _id, workQueueId }) {
    Users.update({ _id }, { $push: { workQueueIds: workQueueId } });
  }

  static filter(data) {
    let filters = {};
    if (data.accountId) {
      try {
        const { clientId } = Accounts.findOne({ _id: data.accountId });
        _.extend(filters, { clientId });
      } catch (error) {
        console.log(error);
      }
    }
    if (data.accountIds) {
      try {
        let accounts = Accounts.find(
          { _id: { $in: data.accountIds } },
          { fields: { clientId: 1 } }
        ).fetch();
        let clientIds = accounts.map(account => {
          return account.clientId;
        });
        _.extend(filters, { clientId: { $all: clientIds } });
      } catch (error) {
        console.log(error);
      }
    }
    return filters;
  }
}
