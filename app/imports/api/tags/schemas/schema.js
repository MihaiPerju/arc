import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  clientId: {
    type: String,
    optional: true,
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
  },
  workQueueStatus: {
    type: Boolean,
    defaultValue: false
  },
});
