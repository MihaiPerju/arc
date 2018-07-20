import SimpleSchema from "simpl-schema";
import inputSchema from "./inputSchema";

export default new SimpleSchema({
  title: {
    type: String
  },
  description: {
    type: String,
    optional: true
  },
  state: {
    type: String,
    optional: true
  },
  substateId: {
    type: String,
    optional: true
  },
  systemAction: {
    type: Boolean,
    defaultValue: false
  },
  inputs: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "inputs.$": {
    type: inputSchema,
    optional: true
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String,
    optional: true
  }
});
