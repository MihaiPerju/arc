import Rules from "/imports/api/rules/collection.js";
import FieldsGenerator from "./FieldsGenerator";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import Facilities from "/imports/api/facilities/collection";
import Users from "/imports/api/users/collection";
import Tags from "/imports/api/tags/collection";
import Actions from "/imports/api/actions/collection";
import RolesEnum from "/imports/api/users/enums/roles";
import { moduleNames } from "/imports/api/tags/enums/tags";

Meteor.methods({
  "rules.get"(params) {
    const queryParams = QueryBuilder.getRulesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    //Project fields
    options.fields = { name: 1 };
    return Rules.find(filters, options).fetch();
  },

  "rules.count"(params) {
    const queryParams = QueryBuilder.getRulesParams(params);
    let filters = queryParams.filters;
    return Rules.find(filters).count();
  },

  "rule.getOne"(_id) {
    return Rules.findOne({ _id });
  },

  "rule.getFilterOptions"(clientId) {
    const facilities = Facilities.find(
      { clientId },
      { fields: { name: 1 } }
    ).fetch();
    const users = Users.find(
      { roles: { $in: [RolesEnum.REP] } },
      { fields: { profile: 1 } }
    ).fetch();
    const workQueues = Tags.find(
      { entities: { $in: [moduleNames.WORK_QUEUE] } },
      { fields: { name: 1 } }
    ).fetch();
    const actions = Actions.find({}, { fields: { title: 1 } }).fetch();


    const facilityOptions = [{ label: "All", value: "all" }].concat(
      facilities.map(facility => {
        return { label: facility.name, value: facility._id };
      })
    );

    const userOptions = users.map(user => {
      return {
        label:
          user.profile && user.profile.lastName + " " + user.profile.firstName,
        value: user._id
      };
    });

    const workQueueOptions = workQueues.map(workQueue => {
      return {
        label: workQueue.name,
        value: workQueue._id
      };
    });

    const actionOptions = actions.map(action => {
      return {
        label: action.title,
        value: action._id
      };
    });

    return {
      facilityOptions,
      userOptions,
      workQueueOptions,
      actionOptions
    };
  },

  "rule.create"(data) {
    const { priority, clientId } = data;
    Rules.update(
      {
        priority: {
          $gte: priority
        },
        clientId
      },
      {
        $inc: {
          priority: 1
        }
      },
      {
        multi: true
      }
    );
    Rules.insert(data);
  },

  "rule.getPrior"(filters = {}) {
    return Rules.findOne(filters, { sort: { priority: -1 } });
  },

  "rule.update"(data) {
    const { priority, clientId } = data;
    //Increase priority for all the rules that have a priority greater than or equal to the new one
    Rules.update(
      {
        priority: {
          $gte: priority
        },
        clientId
      },
      {
        $inc: {
          priority: 1
        }
      },
      {
        multi: true
      }
    );

    //Update the rule itself
    Rules.update(
      {
        _id: data._id
      },
      {
        $set: data
      }
    );
  },
  "rule.delete"(_id) {
    //Take care of the security
    Rules.remove({
      _id
    });
  },

  "rules.delete"(ids) {
    //Take care of the security
    Rules.remove({
      _id: {
        $in: ids
      }
    });
  },

  "rules.getFields"() {
    return FieldsGenerator.getFields();
  }
});
