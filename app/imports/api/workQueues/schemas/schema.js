import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  clientId: {
    type: String
  },
  facilityId: {
    type: String
  }
});
