import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  messages: {
    type: Array,
    defaultValue: [],
    optional: true
  },
  "messages.$": {
    type: Object
  },
  "messages.$.reason": {
    type: String
  },
  "messages.$.tickleDate": {
    type: Date
  },
  "messages.$.userName": {
    type: String
  },
  "messages.$.createdAt": {
    type: Date,
    defaultValue: new Date()
  },
  accountId: {
    type: String
  }
});
