import ModuleTags from "../collection";
import Security from "/imports/api/security/security.js";

Meteor.methods({
  "moduleTag.create"(data) {
    Security.isAdminOrTech(this.userId);
    console.log("data", data);
    ModuleTags.insert(data);
  },

  "moduleTag.edit"(_id, { name, moduleNames }) {
    Security.isAdminOrTech(this.userId);
    return ModuleTags.update(
      { _id },
      {
        $set: {
          moduleNames,
          name
        }
      }
    );
  },

  "moduleTag.deleteMany"(Ids) {
    Security.isAdminOrTech(this.userId);
    _.each(Ids, _id => {
      ModuleTags.remove({ _id });
    });
  }
});
