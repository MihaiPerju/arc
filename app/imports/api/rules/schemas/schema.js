import SimpleSchema from "simpl-schema";
import triggerTypes from "../enums/triggers";

export default new SimpleSchema({
  name: {
    type: String,
  },
  description: {
    type: String,
    optional:true
  },
  clientId: {
    type: String,
  },
  facilityId: {
    type: String,
  },
  rule: {
    type: Object,
    blackbox: true
  },
  priority: {
    type: SimpleSchema.Integer,
    min: 1,
  },
  isBreakingLoop: {
    type: Boolean,
    defaultValue: false
  },
  triggerType: {
    type: String,
    allowedValues: triggerTypes,
  },
  actionId: {
    type: String,
    optional: true
  },
  assigneeId: {
    type: String,
    optional: true
  },
  workQueueId: {
    type: String,
    optional: true
  },
  editField: {
    type: String,
    optional: true
  },
  editValue: {
    type: String,
    optional: true
  }
});
