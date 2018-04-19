import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  type: {
    type: String
  },
  reportId: {
    type: String,
    optional: true
  },
  workerId: {
    type: String,
    optional: true
  },
  timeStamp: {
    type: String,
    optional: true
  }
});
