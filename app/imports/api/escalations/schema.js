import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
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
  },
  accountId: {
    type: String
  }
});
