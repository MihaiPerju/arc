import Codes from "/imports/api/codes/collection.js";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";

Meteor.methods({
  "codes.get"(params) {
    const queryParams = QueryBuilder.getCodesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    return Codes.find(filters, options).fetch();
  },

  "codes.count"(params) {
    const queryParams = QueryBuilder.getCodesParams(params);
    let filters = queryParams.filters;
    return Codes.find(filters).count();
  },

  "code.create"(data) {
    Codes.insert(data);
  },

  "code.edit"(
    id,
    { code, type, action, description, description_short, denial_action }
  ) {
    Codes.update(
      { _id: id },
      {
        $set: {
          code,
          action,
          type,
          description,
          description_short,
          denial_action
        }
      }
    );
  },

  "code.delete"(id) {
    Codes.remove({ _id: id });
  },

  "code.deleteMany"(ids) {
    Codes.remove({ _id: { $in: ids } });
  },

  "code.tag"({ _id, tagIds }) {
    Codes.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
