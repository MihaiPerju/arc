import SimpleSchema from "simpl-schema";
import StateEnum from "./enums/states";
import {
  Substates
} from "./enums/substates";
import insuranceSchema from "/imports/api/facilities/schemas/insuranceSchema";

export default new SimpleSchema({
  collectedAmount: {
    type: SimpleSchema.Integer,
    defaultValue: 0
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
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
    type: String,
    optional: true
  },
  activeInsCode: {
    type: String,
    optional: true
  },
  activeInsName: {
    type: String,
    optional: true
  },
  lastUserAction: {
    type: String,
    optional: true
  },
  insurances: {
    type: Array,
    optional: true,
    autoValue: function () {
      let arrayLen = this.value ? this.value.length : 0;
      for (let i = 0; i < arrayLen; i++) {
        let index = i;
        const objectValues = Object.values(this.value[i]);
        const objectValuesLen = objectValues.length;
        let isNull = true;
        for (let j = 0; j < objectValuesLen; j++) {
          if (objectValues[j]) {
            isNull = false;
            index = null;
            break;
          }
        }
        if (isNull && index != null) {
          this.value.splice(index, 1);
          i--;
          arrayLen--;
        }
      }
    }
  },
  "insurances.$": {
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
    allowedValues: _.map(StateEnum, (value) => value)
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
  "attachmentIds.$": {
    type: String
  },
  actionsLinkData: {
    type: Array,
    optional: true
  },
  "actionsLinkData.$": {
    type: String
  },
  metadata: {
    type: Object,
    blackbox: true,
    optional: true
  },
  managerIds: {
    type: Array,
    optional: true
  },
  "managerIds.$": {
    type: String
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
  tickleUserId: {
    type: String,
    optional: true
  },
  tickleReason: {
    type: String,
    optional: true
  },
  employeeToRespond: {
    type: String,
    optional: true
  },
  escalationId: {
    type: String,
    optional: true
  },
  workQueueId: {
    type: String,
    optional: true
  },
  numberOfViews: {
    type: SimpleSchema.Integer,
    optional: true,
    defaultValue: 0
  },
  commentIds: {
    type: Array,
    optional: true
  },
  "commentIds.$": {
    type: String
  },
  invoiceNo: {
    type: Array,
    optional: true,
    autoValue: function () {
      let arrayLen = this.value ? this.value.length : 0;
      for (let i = 0; i < arrayLen; i++) {
        if (!this.value[i]) {
          this.value.splice(i, 1);
        }
      }
    }
  },
  "invoiceNo.$": {
    type: String
  },
  letterIds: {
    type: Array,
    optional: true
  },
  "letterIds.$": {
    type: String
  },
  flagIds: {
    type: Array,
    optional: true
  },
  "flagIds.$": {
    type: String
  },
  other1: {
    type: SimpleSchema.oneOf(Number, Date, String),
    optional: true
  },
  other2: {
    type: SimpleSchema.oneOf(Number, Date, String),
    optional: true
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  },
  lockOwnerId: {
    type: String,
    optional: true
  },
  lockTimestamp: {
    type: Date,
    optional: true
  },
  lockBreakUsers: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "lockBreakUsers.$": {
    type: String
  },
  flagCounter: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  isPending: {
    type: Boolean,
    defaultValue: true
  },
  placementDate: {
    type: Date,
    optional: true
  },
  reactivationDate: {
    type: Date,
    optional: true
  },
  refreshDate: {
    type: Date,
    optional: true
  },
  lastUserAction: {
    type: String,
    optional: true
  },
  lastActionDate: {
    type: Date,
    optional: true
  }
});

