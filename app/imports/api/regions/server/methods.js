import Regions from "../collection.js";
import Security from "/imports/api/security/security.js";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";

Meteor.methods({
  "regions.list"(params) {
    const queryParams = QueryBuilder.getRegionsParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    options.fields = { name: 1 };
    return Regions.find(filters, options).fetch();
  },

  "regions.count"(params) {
    const queryParams = QueryBuilder.getRegionsParams(params);
    let filters = queryParams.filters;
    return Regions.find(filters).count();
  },

  "region.getOne"(_id) {
    Security.isAdminOrTech(this.userId);

    return Regions.findOne({ _id });
  },

  "region.create"(data) {
    Security.isAdminOrTech(this.userId);

    Regions.insert(data);
  },

  "regions.get"(filters = {}) {
    return Regions.find(filters).fetch();
  },

  "region.update"({ _id, name }) {
    Security.isAdminOrTech(this.userId);

    Regions.update(
      { _id },
      {
        $set: {
          name
        }
      }
    );
  },

  "region.delete"(id) {
    Security.isAdminOrTech(this.userId);

    Regions.remove({ _id: id });
  },

  "region.deleteMany"(ids) {
    Security.isAdminOrTech(this.userId);

    Regions.remove({ _id: { $in: ids } });
  }
});
