import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    hasHeader: {
        type: Boolean,
        allowedValues: [true, false],
        defaultValue: false,
        label: 'Does the file have a header?'
    },
    acctNum: {
        type: SimpleSchema.Integer,
        optional: true,
        label: 'Account Number'
    },
    facCode: {
        type: SimpleSchema.Integer,
        optional: true
    },
    ptType: {
        type: SimpleSchema.Integer,
        optional: true
    },
    ptName: {
        type: SimpleSchema.Integer,
        optional: true
    },
    dischrgDate: {
        type: SimpleSchema.Integer,
        optional: true
    },
    fbDate: {
        type: SimpleSchema.Integer,
        optional: true
    },
    acctBal: {
        type: SimpleSchema.Integer,
        optional: true
    },
    finClass: {
        type: SimpleSchema.Integer,
        optional: true
    },
    admitDate: {
        type: SimpleSchema.Integer,
        optional: true
    },
    medNo: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insName: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insName2: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insName3: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCode: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCode2: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCode3: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBal: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBal2: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBal3: {
        type: SimpleSchema.Integer,
        optional: true
    }
})