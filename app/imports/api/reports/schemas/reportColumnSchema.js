import SimpleSchema from "simpl-schema";
import insuranceColumnSchema from "./insuranceColumnSchema";

export default new SimpleSchema({
  acctNum: {
    type: Boolean,
    optional: true,
    defaultValue: true
  },
  facCode: {
    type: Boolean,
    optional: true,
    defaultValue: true
  },
  ptType: {
    type: Boolean,
    optional: true,
    defaultValue: true
  },
  ptName: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  dischrgDate: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  fbDate: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  acctBal: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  finClass: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  admitDate: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  medNo: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  state: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  substate: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  activeInsCode: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  insurances: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "insurances.$": {
    type: insuranceColumnSchema,
    optional: true
  },
  metaData: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  tickleDate: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  tickleReason: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  workQueue: {
    type: Boolean,
    optional: true,
    defaultValue: false
  }
});
