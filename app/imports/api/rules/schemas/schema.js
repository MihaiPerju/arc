import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  clientId: {
    type: String
  },
  facilityId: {
    type: String
  },
  rule: {
    type: Object,
    blackbox: true
  },
  priority: {
    type: SimpleSchema.Integer,
    min: 1
  }
});
