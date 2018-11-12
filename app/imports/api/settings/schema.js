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
      settings.THRESHOLDS
    ]
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
  }
});
