import SimpleSchema from "simpl-schema";
import triggerTypes from "../enums/triggers";

export default new SimpleSchema({
  name: {
    type: String,
   
    optional:true
  },
  description: {
    type: String,

    optional:true

  },
  clientId: {
    type: String,

    optional:true

  },
  facilityId: {
    type: String,

    optional:true
  },
  rule: {
    type: Object,
    blackbox: true
  },
  priority: {
    type: SimpleSchema.Integer,
    min: 1,

    optional:true
  },
  isBreakingLoop: {
    type: Boolean,
    defaultValue: false
  },
  triggerType: {
    type: String,
    allowedValues: triggerTypes,
    
    optional:true
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
