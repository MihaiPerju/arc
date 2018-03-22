import SimpleSchema from 'simpl-schema';
import StateEnum from './enums/states';
import {Substates} from './enums/substates';
import ActionSchema from './schemas/actionSchema.js';
import insuranceSchema from '/imports/api/facilities/schemas/insuranceSchema';

export default new SimpleSchema({
    collectedAmount: {
        type: SimpleSchema.Integer,
        defaultValue: 0
    },
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
    insurances: {
        type: Array,
        optional: true
    },
    'insurances.$': {
        type: insuranceSchema
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
    clientId: {
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
        type: String
    },
    metaData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    fileId: {
        type: String
    },
    hasLastSysAction: {
        type: Boolean,
        defaultValue: true
    }
})