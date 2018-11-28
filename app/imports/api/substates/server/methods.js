import Substates from "../collection";
import Security from "/imports/api/security/security";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";

Meteor.methods({
  "substates.get"(params) {
    const queryParams = QueryBuilder.getSubstatesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    return Substates.find(filters, options).fetch();
  },

  "substates.count"(params) {
    const queryParams = QueryBuilder.getSubstatesParams(params);
    let filters = queryParams.filters;
    return Substates.find(filters).count();
  },

  "substate.create"(data) {
    Security.checkAdmin(this.userId);

    Substates.insert(data);
  },

  "substate.update"(data) {
    Security.checkAdmin(this.userId);
    data.updatedAt = new Date();
    Substates.update(
      { _id: data._id },
      {
        $set: data
      }
    );
  },

  "substate.delete"(_id) {
    Security.checkAdmin(this.userId);
    Substates.update({ _id }, { $set: { status: false } });
  },

  "substate.deleteMany"(ids) {
    Security.checkAdmin(this.userId);

    Substates.update(
      {
        _id: {
          $in: ids
        }
      },
      {
        $set: { status: false }
      },
      { multi: true }
    );
  },

  "substate.tag"({ _id, tagIds }) {
    Substates.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
