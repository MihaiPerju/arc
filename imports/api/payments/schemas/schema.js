import SimpleSchema from 'simpl-schema';
import insuranceSchema from '/imports/api/facilities/schemas/insuranceSchema';

export default new SimpleSchema({
    ptName: {
        type: String,
        label: "Patient Name",
        optional: true
    },
    acctNum: {
        type: String,
        label: "Account Number"
    },
    admitDate: {
        type: Date,
        label: "Admit Date",
        optional: true
    },
    dischrgDate: {
        type: Date,
        label: "Discharge Date",
        optional: true
    },
    payorCode: {
        type: String,
        label: "Payor Code"
    },
    insName: {
        type: String,
        label: "Insurance Name",
        optional: true
    },
    newInsBal: {
        type: Array,
        label: "New Insurance Balance",
        optional: true
    },
    'newInsBal.$': {
        type: insuranceSchema.omit('insName', 'insCode')
    },
    newAcctBal: {
        type: SimpleSchema.Integer,
        label: "New Account Balance",
        optional: true
    },
    ptBal: {
        type: SimpleSchema.Integer,
        label: "Payment Balance",
        optional: true
    },
    finClass: {
        type: String,
        label: "Financial Class",
        optional: true
    },
    transDate: {
        type: Date,
        label: "Transaction Date"
    },
    transType: {
        type: String,
        label: "Transaction Type"
    },
    transAmount: {
        type: SimpleSchema.Integer,
        label: "Transaction Amount"
    }
});
