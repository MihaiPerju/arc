import SimpleSchema from 'simpl-schema';
import insuranceSchema from './insuranceSchema';

export default new SimpleSchema({
    hasHeader: {
        type: Boolean,
        allowedValues: [true, false]
    },
    acctNum: {
        type: String,
        optional: true,
        label: 'Account Number'
    },
    facCode: {
        type: String,
        optional: true,
        label: 'Facility Code'
    },
    ptType: {
        type: String,
        optional: true,
        label: 'Payment Type'
    },
    ptName: {
        type: String,
        optional: true,
        label: 'Payment Name'
    },
    dischrgDate: {
        type: String,
        optional: true,
        label: 'Discharge Date'
    },
    fbDate: {
        type: String,
        optional: true,
        label: 'Fb Date'
    },
    acctBal: {
        type: String,
        optional: true,
        label: 'Account Balance'
    },
    finClass: {
        type: String,
        optional: true,
        label: 'Financial Class'
    },
    admitDate: {
        type: String,
        optional: true,
        label: 'Admit Date'
    },
    medNo: {
        type: String,
        optional: true,
        label: 'Medical Number'
    },
    insurances: {
        type: Array,
        optional: true,
        label: 'Insurances'
    },
    'insurances.$': {
        type: insuranceSchema
    }
});