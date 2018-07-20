import Codes from "/imports/api/codes/collection.js";

Meteor.methods({
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
