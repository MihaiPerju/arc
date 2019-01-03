import WorkQueues from "../collection.js";
import Users from "/imports/api/users/collection.js";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import WorkQueueService from "/imports/api/workQueues/server/services/WorkQueueService";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import Accounts from "/imports/api/accounts/collection";

Meteor.methods({
  "workQueues.list"(params) {
    const queryParams = QueryBuilder.getWorkQueuesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    options.fields = { name: 1 };
    return WorkQueues.find(filters, options).fetch();
  },

  "workQueues.count"(params) {
    const queryParams = QueryBuilder.getWorkQueuesParams(params);
    let filters = queryParams.filters;
    return WorkQueues.find(filters).count();
  },

  "workQueue.getOne"(_id) {
    return WorkQueues.findOne({ _id });
  },

  "workQueues.get"(data = {}) {
    let filters = WorkQueueService.filter(data);
    console.log(filters);
    return WorkQueues.find(filters).fetch();
  },

  "workQueue.create"(data) {
    return WorkQueueService.createWorkQueue(data);
  },

  "workQueue.delete"(_id) {
    if (Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
      WorkQueues.remove({ _id });

      //Unassigning accounts from Work Queues
      let workQueueId = _id;
      Accounts.update({ workQueueId }, { $unset: { workQueueId: null } });
    } else {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },

  "workQueue.edit"(id, data) {
    return WorkQueues.update(
      { _id: id },
      {
        $set: data
      }
    );
  },

  "workQueues.deleteMany"(ids) {
    WorkQueues.remove({ _id: { $in: ids } });
  },

  "user.addWorkQueue"({ userIds, workQueueId }) {
    if (Roles.userIsInRole(this.userId, roleGroups.ADMIN_TECH_MANAGER)) {
      _.each(userIds, _id => {
        return WorkQueueService.addWorkQueueToUser({ _id, workQueueId });
      });
    } else {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },

  "user.removeWorkQueues"({ userIds, workQueueId }) {
    if (Roles.userIsInRole(this.userId, roleGroups.ADMIN_TECH_MANAGER)) {
      Users.update(
        { _id: { $in: userIds } },
        { $pull: { workQueueIds: workQueueId } }
      );
    } else {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  }
});
