import SimpleSchema from "simpl-schema";
import Statuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

export default new SimpleSchema({
  type: {
    type: String
  },
  reportId: {
    type: String,
    optional: true
  },
  workerId: {
    type: String,
    optional: true
  },
  timeStamp: {
    type: String,
    optional: true
  },
  filePath: {
    type: String,
    optional: true
  },
  facilityId: {
    type: String,
    optional: true
  },
  fileType: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  status: {
    type: String,
    defaultValue: Statuses.NEW
  },
  fileId: {
    type: String,
    optional: true
  },
  placementDate: {
    type: Date,
    optional: true
  },
  assignType: {
    type: String,
    optional: true
  },
  facilityType: {
    type: String,
    optional: true
  },
  userType: {
    type: String,
    optional: true
  },
  workQueueId: {
    type: String,
    optional: true
  },
  actionId: {
    type: Object,
    blackbox: true,
    optional: true
  },
  reasonCodes:{
    type: Array,
    optional: true
  },
  "reasonCodes.$":{
    type: String,
    optional: true
  },
  customFields: {
    type: Object,
    blackbox: true,
    optional: true
  },
  clientId:{
    type: String,
    optional: true
  }
});
