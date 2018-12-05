import SimpleSchema from "simpl-schema";
import insuranceSchema from "./insuranceSchema";

export default new SimpleSchema({
  hasHeader: {
    type: Boolean,
    allowedValues: [true, false]
  },
  ptName: {
    label: "Pacient Name",
    type: String,
    optional: true
  },
  acctNum: {
    label: "Account Number",
    type: String,
    optional: true
  },
  admitDate: {
    label: "Admit Date",
    type: String,
    optional: true
  },
  dischrgDate: {
    label: "Discharge Date",
    type: String,
    optional: true
  },
  payorCode: {
    label: "Payor Code",
    type: String,
    optional: true
  },
  insName: {
    label: "Insurance Name",
    type: String,
    optional: true
  },
  newAcctBal: {
    label: "New Account Balance",
    type: String,
    optional: true
  },
  ptBal: {
    label: "Pacient Balance",
    type: String,
    optional: true
  },
  newInsBal: {
    label: "New Insurance Balance",
    type: Array,
    optional: true
  },
  "newInsBal.$": {
    label: "Insurance Balance",
    type: insuranceSchema.omit("insName", "insCode"),
    optional: true
  },
  finClass: {
    label: "Financial Class",
    type: String,
    optional: true
  },
  transDate: {
    label: "Transaction Date",
    type: String,
    optional: true
  },
  transType: {
    label: "Transaction Type",
    type: String,
    optional: true
  },
  transAmount: {
    label: "Transaction Amount",
    type: String,
    optional: true
  }
});
