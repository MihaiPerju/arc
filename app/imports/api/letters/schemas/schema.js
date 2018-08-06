import SimpleSchema from "simpl-schema";
import Statuses from "../enums/statuses.js";

export default new SimpleSchema({
  body: {
    type: String
  },
  accountId: {
    type: String
  },
  status: {
    type: String,
    allowedValues: Statuses,
    defaultValue: Statuses.NEW
  },
  createAt: {
    type: Date,
    optional: true
  },
  attachmentIds: {
    type: Array,
    optional: true
  },
  "attachmentIds.$": {
    type: String
  },
  letterTemplateId: {
    type: String,
    optional: true
  },
  letterTemplateName: {
    type: String,
    optional: true
  },
  letterValues: {
    type: Object,
    optional: true,
    blackbox: true
  },
  firstScanDate: {
    type: Date,
    optional: true
  },
  inHomeDate: {
    type: Date,
    optional: true
  },
  isManuallyMailed: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  },
});
