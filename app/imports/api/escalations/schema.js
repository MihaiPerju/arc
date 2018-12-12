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
  "messages.$.userName": {
    type: String
  },
  "messages.$.createdAt": {
    type: Date,
    defaultValue: new Date()
  },
  accountId: {
    type: String
  },
  resolved: {
    type: Boolean,
    defaultValue: false
  },
  resolvedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  clientId: {
    type: String
  }
});
