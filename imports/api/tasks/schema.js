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
        optional: true,
        autoValue: function() {
            const arrayLen = this.value.length;
            for(let i = 0; i < arrayLen; i++) {
                let index = i;
                const objectValues = Object.values(this.value[i]);
                const objectValuesLen = objectValues.length;
                let isNull = true;
                for(let j = 0; j < objectValuesLen; j++) {
                    if(objectValues[j]) {
                        isNull = false;
                        index = null;
                        break;
                    }
                }
                if(isNull && index) {
                    this.value.splice(index, 1);
                }
            }
        }
    },
    'insurances.$': {
        type: insuranceSchema,
        optional: true
    },
    "insurances.$.zip": {
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
        defaultValue: Substates.NEW
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
    },
    tickleDate: {
        type: Date,
        optional: true
    },
    escalateReason: {
        type: String,
        optional: true
    },
    workQueue: {
        type: String,
        optional: true
    },
    numberOfViews: {
        type: Number,
        optional: true,
        defaultValue: 0
    }
})