import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  name: {
    type: String,
  },
  clientId: {
    type: String
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  },
  entities: {
    type: Array,
    defaultValue: []
  },
  "entities.$": {
    type: String
  }
});
