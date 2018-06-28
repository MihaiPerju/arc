import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  open: {
    type: Boolean,
    defaultValue: true
  },
  authorId: {
    type: String
  },
  actionId: {
    type: String
  },
  fields: {
    type: Array
  },
  "fields.$": {
    type: String
  },
  metafields: {
    type: Array
  },
  "metafields.$": {
    type: String
  },
  message: {
    type: String,
    optional: true
  },
  managerId: {
    type: String,
    optional: true
  }
});
