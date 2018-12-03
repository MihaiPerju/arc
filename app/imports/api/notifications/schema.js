import SimpleSchema from "simpl-schema";
import TypesEnum from "./enums/notificationTypes";

export default new SimpleSchema({
  receiverId: {
    type: String
  },
  seen: {
    type: Boolean,
    defaultValue: false
  },
  message: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    defaultValue: TypesEnum.SYSTEM,
    allowedValues: TypesEnum
  },
  metadata: {
    type: Object,
    optional: true,
    blackbox: true
  },
  createdAt: {
    type: Date,
    optional: true
  }
});
