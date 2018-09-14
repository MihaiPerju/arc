import Rules from "/imports/api/rules/collection.js";
import FilterBuilder from "../services/FilterBuilder";
import triggerTypes, {
  triggerOptions
} from "/imports/api/rules/enums/triggers";

Meteor.methods({
  "rule.create"(data) {
    const { priority, clientId } = data;
    Rules.update(
      {
        priority: { $gte: priority },
        clientId
      },
      {
        $inc: { priority: 1 }
      },
      { multi: true }
    );
    Rules.insert(data);
  },

  "rule.update"(data) {
    const { triggerType, priority, clientId } = data;
    Rules.update(
      {
        priority: { $gte: priority },
        clientId
      },
      {
        $inc: { priority: 1 }
      },
      { multi: true }
    );

    let unsetter = {};
    if (triggerType == triggerTypes.EDIT) {
      unsetter = {
        assigneeId: null,
        workQueueId: null,
        actionId: null
      };
    } else if (triggerType === triggerTypes.ASSIGN_USER) {
      unsetter = {
        editField: null,
        editValue: null,
        actionId: null,
        workQueueId: null
      };
    } else if (triggerType === triggerTypes.ASSIGN_WORK_QUEUE) {
      unsetter = {
        editField: null,
        editValue: null,
        assigneeId: null,
        actionId: null
      };
    } else if (triggerType === triggerTypes.ACTION) {
      unsetter = {
        assigneeId: null,
        workQueueId: null,
        editField: null,
        editValue: null
      };
    }

    Rules.update(
      {
        _id: data._id
      },
      {
        $set: data
        // $unset: unsetter
      }
    );
  },
  "rule.delete"(_id) {
    //Take care of the security
    Rules.remove({ _id });
  },

  "rules.delete"(ids) {
    //Take care of the security
    Rules.remove({ _id: { $in: ids } });
  }
});
