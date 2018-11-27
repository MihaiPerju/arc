import Codes from "/imports/api/codes/collection.js";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";

Meteor.methods({
  "codes.get"(params) {
    const queryParams = QueryBuilder.getCodesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    //Project fields
    options.fields = { code: 1, tagIds: 1 };
    return Codes.find(filters, options).fetch();
  },

  "codes.count"(params) {
    const queryParams = QueryBuilder.getCodesParams(params);
    let filters = queryParams.filters;
    return Codes.find(filters).count();
  },

  "code.getOne"(_id) {
    return Codes.findOne({ _id });
  },

  "codes.getNames"(filters = {}) {
    return Codes.find(filters).fetch();
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
