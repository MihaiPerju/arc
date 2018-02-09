import SimpleSchema from 'simpl-schema';
import StateEnum from './enums/states';
import {Substates} from './enums/substates';
import ActionSchema from './schemas/actionSchema.js';

export default new SimpleSchema({
    createdAt: {
        type: Date,
        defaultValue: new Date
    },
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
        type: Date,
        optional: true
    },
    fbDate: {
        type: Date,
        optional: true
    },
    acctBal: {
        type: SimpleSchema.Integer,
        optional: true
    },
    finClass: {
        type: String,
        optional: true
    },
    admitDate: {
        type: Date,
        optional: true
    },
    medNo: {
        type: SimpleSchema.Integer,
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
    },
    state: {
        type: String,
        defaultValue: StateEnum.ACTIVE,
        allowedValues: _.map(StateEnum, (value, key) => (value))
    },
    substate: {
        type: String,
        defaultValue: Substates.NEW,
        allowedValues: _.map(Substates, (value, key) => (value))
    },
    facilityId: {
        type: String
    },
    assigneeId: {
        type: String,
        optional: true
    },
    attachmentIds: {
        type: Array,
        optional: true
    },
    'attachmentIds.$': {
        type: String,
    },
    actionsLinkData: {
        type: Array,
        optional: true
    },
    'actionsLinkData.$': {
        type: Object,
        blackbox: true
    },
    metaData: {
        type: Object,
        blackbox: true,
        optional: true
    }
})