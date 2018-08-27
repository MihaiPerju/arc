import SimpleSchema from "simpl-schema";
import UploadStatus from "/imports/api/files/enums/statuses";

export default new SimpleSchema({
  fileName: {
    type: String
  },
  previousFileId: {
    type: String,
    optional: true
  },
  facilityId: {
    type: String
  },
  clientId: {
    type: String
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  status: {
    type: String,
    defaultValue: UploadStatus.SUCCESS
  },
  type: {
    type: String
  },
  header: {
    type: Array,
    optional: true
  },
  "header.$": {
    type: SimpleSchema.oneOf(SimpleSchema.Integer, String)
  }
});
