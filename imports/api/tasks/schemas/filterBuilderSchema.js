import SimpleSchema from 'simpl-schema';
import StateEnum from '/imports/api/tasks/enums/states';
import {Substates} from '/imports/api/tasks/enums/substates';

const allowedMatches = ['Contains', 'Not Contains', 'Is Exact'];

export default new SimpleSchema({
    acctNum: {
        type: String,
        optional: true
    },
    acctNumMatch: {
        type: String,
        allowedValues: allowedMatches,
        optional: true
    },
    facCode: {
        type: String,
        optional: true
    },
    facCodeMatch: {
        type: String,
        allowedValues: allowedMatches,
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
    ptTypeMatch: {
        type: String,
        allowedValues: allowedMatches,
        optional: true
    },
    ptNameMatch: {
        type: String,
        allowedValues: allowedMatches,
        optional: true
    },
    finClass: {
        type: String,
        optional: true
    },
    finClassMatch: {
        type: String,
        allowedValues: allowedMatches,
        optional: true
    },
    insName: {
        type: String,
        optional: true
    },
    insNameMatch: {
        type: String,
        allowedValues: allowedMatches,
        optional: true
    },
    insName2: {
        type: String,
        optional: true
    },
    insName2Match: {
        type: String,
        allowedValues: allowedMatches,
        optional: true
    },
    insName3: {
        type: String,
        optional: true
    },
    insName3Match: {
        type: String,
        allowedValues: allowedMatches,
        optional: true
    },
    medNoStart: {
        type: SimpleSchema.Integer,
        optional: true
    },
    medNoEnd: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCodeStart: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCodeEnd: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCode2Start: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCode2End: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCode3Start: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insCode3End: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBalStart: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBalEnd: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBal2Start: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBal2End: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBal3Start: {
        type: SimpleSchema.Integer,
        optional: true
    },
    insBal3End: {
        type: SimpleSchema.Integer,
        optional: true
    },
    acctBalStart: {
        type: SimpleSchema.Integer,
        optional: true
    },
    acctBalEnd: {
        type: SimpleSchema.Integer,
        optional: true
    },
    dischrgDateStart: {
        type: Date,
        optional: true
    },
    dischrgDateEnd: {
        type: Date,
        optional: true
    },
    fbDateStart: {
        type: Date,
        optional: true
    },
    fbDateEnd: {
        type: Date,
        optional: true
    },
    admitDateStart: {
        type: Date,
        optional: true
    },
    admitDateEnd: {
        type: Date,
        optional: true
    },
    state: {
        type: String,
        allowedValues: _.map(StateEnum, (value, key) => (value)),
        optional: true
    },
    substate: {
        type: String,
        allowedValues: _.map(Substates, (value, key) => (value)),
        optional: true
    },
    facilityId: {
        type: Array,
        optional: true
    },
    'facilityId.$': {
        type: String
    },
    assigneeId: {
        type: Array,
        optional: true
    },
    'assigneeId.$': {
        type: String
    }
});