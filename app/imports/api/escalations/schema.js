import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  open: {
    type: Boolean,
    defaultValue: true
  },
  authorId: {
    type: String
  },
  messages: {
    type: Array
  },
  "messages.$": {
    type: Object
  },
  "messages.$.content": {
    type: String
  }
});
