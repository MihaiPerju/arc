import SimpleSchema from "simpl-schema";
import CodeEnum from "../enums/codes";

export default new SimpleSchema({
  code: {
    type: String
  },
  action: {
    type: String
  },
  type: {
    type: String,
    allowedValues: [CodeEnum.RARC, CodeEnum.CARC]
  },
  description: {
    type: String
  },
  description_short: {
    type: String
  },
  denial_action: {
    type: String
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  }
});
