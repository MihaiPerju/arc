import SimpleSchema from "simpl-schema";
import insuranceSchema from "./insuranceSchema";

export default new SimpleSchema({
  hasHeader: {
    type: Boolean,
    allowedValues: [true, false]
  },
  acctNum: {
    type: String,
    optional: true,
    label: "Account Number"
  },
  facCode: {
    type: String,
    optional: true,
    label: "Facility Code"
  },
  ptType: {
    type: String,
    optional: true,
    label: "Payment Type"
  },
  ptName: {
    type: String,
    optional: true,
    label: "Payment Name"
  },
  dischrgDate: {
    type: String,
    optional: true,
    label: "Discharge Date"
  },
  fbDate: {
    type: String,
    optional: true,
    label: "Fb Date"
  },
  acctBal: {
    type: String,
    optional: true,
    label: "Account Balance"
  },
  finClass: {
    type: String,
    optional: true,
    label: "Financial Class"
  },
  admitDate: {
    type: String,
    optional: true,
    label: "Admit Date"
  },
  medNo: {
    type: String,
    optional: true,
    label: "Medical Number"
  },
  invoiceNo: {
    type: String,
    optional: true,
    label: "Invoice Number"
  },
  activeInsCode: {
    type: String,
    optional: true,
    label: "Active Insurance Code"
  },
  activeInsName: {
    type: String,
    optional: true,
    label: "Active Insurance Name"
  },
  insurances: {
    type: Array,
    label: "Insurances"
  },
  "insurances.$": {
    type: insuranceSchema,
    optional: true
  },
  "insurances.$.zip": {
    type: String,
    optional: true
  },
  other1: {
    type: SimpleSchema.oneOf(Number, Date, String),
    optional: true
  },
  other2: {
    type: SimpleSchema.oneOf(Number, Date, String),
    optional: true
  },
});
