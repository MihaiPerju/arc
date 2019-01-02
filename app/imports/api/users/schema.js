import SimpleSchema from "simpl-schema";
import AvatarThumbsSchema from "/imports/api/uploads/uploads/thumbsSchema";

const AvatarSchema = new SimpleSchema({
  _id: { type: String },
  path: { type: String },
  thumbs: { type: AvatarThumbsSchema }
});

export default new SimpleSchema({
  _id: { type: String },
  username: { type: String, optional: true },
  emails: { type: Array },
  "emails.$": { type: Object },
  "emails.$.address": { type: String },
  "emails.$.verified": { type: Boolean },
  createdAt: { type: Date },
  services: { type: Object, blackbox: true },
  roles: {
    type: Array,
    optional: true
  },
  "roles.$": {
    type: String
  },
  profile: {
    type: Object,
    optional: true
  },
  "profile.phoneNumber": {
    type: String,
    optional: true
  },
  "profile.firstName": {
    type: String,
    optional: true
  },
  "profile.lastName": {
    type: String,
    optional: true
  },
  "profile.goal": {
    type: Number,
    optional: true
  },
  tagIds: {
    type: Array,
    optional: true
  },
  "tagIds.$": {
    type: String
  },
  workQueueIds: {
    type: Array,
    optional: true
  },
  "workQueueIds.$": {
    type: String
  },
  "profile.suspended": { type: Boolean, optional: true },
  avatar: { type: AvatarSchema, optional: true },
  clientIds: {
    type: Array,
    optional: true
  },
  "clientIds.$": {
    type: String,
    optional: true
  }
});
