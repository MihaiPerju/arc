import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  reason: {
    type: String
  },
  actionId: {
    type: String,
    optional: true
  },
  managerId: {
    type: String,
    optional: true
  }
});
