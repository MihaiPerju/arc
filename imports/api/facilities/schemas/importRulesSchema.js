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
    FacCode: {
        type: SimpleSchema.Integer,
        optional: true
    },
    PtType: {
        type: SimpleSchema.Integer,
        optional: true
    },
    PtName: {
        type: SimpleSchema.Integer,
        optional: true
    },
    DischrgDate: {
        type: SimpleSchema.Integer,
        optional: true
    },
    FBDate: {
        type: SimpleSchema.Integer,
        optional: true
    },
    AcctBal: {
        type: SimpleSchema.Integer,
        optional: true
    },
    FinClass: {
        type: SimpleSchema.Integer,
        optional: true
    },
    AdmitDate: {
        type: SimpleSchema.Integer,
        optional: true
    },
    MedNo: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsName: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsName2: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsName3: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsCode: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsCode2: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsCode3: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsBal: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsBal2: {
        type: SimpleSchema.Integer,
        optional: true
    },
    InsBal3: {
        type: SimpleSchema.Integer,
        optional: true
    }
})