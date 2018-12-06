import SimpleSchema from "simpl-schema";
import settings from "/imports/api/settings/enums/settings";

export default new SimpleSchema({
  name: {
    type: String,
    allowedValues: [
      settings.ROOT,
      settings.SMTP,
      settings.LETTERS_DIRECTORY,
      settings.COMPILE_TIME,
      settings.THRESHOLDS,
      settings.WIDGET_SETTINGS
    ]
  },
  userId: {
    type: String,
    optional: true
  },
  root: {
    type: String,
    optional: true
  },
  smtp: { type: Object, optional: true },
  "smtp.serverAddress": {
    type: String,
    optional: true
  },
  "smtp.ssl": {
    type: Boolean,
    optional: true
  },
  "smtp.port": {
    type: String,
    optional: true
  },
  "smtp.authentication": {
    type: String,
    optional: true
  },
  "smtp.username": {
    type: String,
    optional: true
  },
  "smtp.password": {
    type: String,
    optional: true
  },
  letterDirectory: {
    type: String,
    optional: true
  },
  letterCompileTime: {
    type: String,
    optional: true
  },
  satisfactory: {
    type: Number,
    optional: true
  },
  unsatisfactory: {
    type: Number,
    optional: true
  },
  acceptanceRatio: {
    type: Number,
    optional: true
  },
  widgetSetting: {
    type: Object,
    optional: true
  },
  "widgetSetting.escalation_resolved": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.account_assigned": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.report_generated": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.holds_removed": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.report_sent": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.account_archived": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.manager_rank": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.new_alert": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.reports_built": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.bulkActionRequestQueue": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.failedUploadQueue": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.assignedToMe": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.completed": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.collectedToday": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.closedAccounts": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.closeAssists": {
    type: Boolean,
    optional: true
  }
});
