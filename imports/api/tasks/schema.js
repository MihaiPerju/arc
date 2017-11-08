import SimpleSchema from 'simpl-schema';
import stateEnum from './enums/states';

export default new SimpleSchema({
    acctNum: {
        type: String,
        optional: true
    },
    facCode: {
        type: String,
        optional: true
    },
    ptType: {
        type: String,
        optional: true
    },
    ptName: {
        type: String,
        optional: true
    },
    dischrgDate: {
        type: String,
        optional: true
    },
    fbDate: {
        type: String,
        optional: true
    },
    acctBal: {
        type: String,
        optional: true
    },
    finClass: {
        type: String,
        optional: true
    },
    admitDate: {
        type: String,
        optional: true
    },
    medNo: {
        type: String,
        optional: true
    },
    insName: {
        type: String,
        optional: true
    },
    insName2: {
        type: String,
        optional: true
    },
    insName3: {
        type: String,
        optional: true
    },
    insCode: {
        type: String,
        optional: true
    },
    insCode2: {
        type: String,
        optional: true
    },
    insCode3: {
        type: String,
        optional: true
    },
    insBal: {
        type: String,
        optional: true
    },
    insBal2: {
        type: String,
        optional: true
    },
    insBal3: {
        type: String,
        optional: true
    },
    state: {
        type: String,
        defaultValue: stateEnum.ACTIVE,
        allowedValues: [stateEnum.ACTIVE, stateEnum.ARCHIVED]
    },
    facilityId: {
        type: String
    }
})