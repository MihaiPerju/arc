import SimpleSchema from "simpl-schema";
import TypesEnum from "./enums/notificationTypes";

export default new SimpleSchema({
  receiverId: {
    type: String
  },
  seen: {
    type: Boolean
  },
  message: {
    type: String
  },
  type: {
    type: String,
    defaultValue: TypesEnum.SYSTEM,
    allowedValues: TypesEnum
  }
});
