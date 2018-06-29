import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  open: {
    type: Boolean,
    defaultValue: true
  },
  authorId: {
    type: String,
    optional: true
  },
  actionId: {
    type: String,
    optional: true
  },
  flagReason: {
    type: String,
    optional: true
  },
  flagResponse: {
    type: String,
    optional: true
  },
  managerId: {
    type: String,
    optional: true
  }
});
