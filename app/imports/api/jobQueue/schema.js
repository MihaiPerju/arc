import SimpleSchema from "simpl-schema";

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
    type: String
  }
});