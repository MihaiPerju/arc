import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  name: {
    type: String
  },
  moduleNames: {
    type: Array,
    defaultValue: []
  },
  "moduleNames.$": {
    type: String
  }
});
