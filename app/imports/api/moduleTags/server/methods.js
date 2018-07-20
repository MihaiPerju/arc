import ModuleTags from "../collection";
import Security from "/imports/api/security/security.js";

Meteor.methods({
  "moduleTag.create"(data) {
    Security.isAdminOrTech(this.userId);
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

  "moduleTag.deleteMany"(ids) {
    Security.isAdminOrTech(this.userId);
    ModuleTags.remove({ _id: { $in: ids } });
  }
});
