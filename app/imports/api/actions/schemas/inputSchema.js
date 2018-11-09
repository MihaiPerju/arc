import SimpleSchema from "simpl-schema";
import requirementTypes from "/imports/api/actions/enums/requirementEnum";

export default new SimpleSchema({
  type: {
    type: String
  },
  label: {
    type: String
  },
  requirement: {
    type: String,
    defaultValue: requirementTypes.OPTIONAL,
    allowedValues: [requirementTypes.OPTIONAL, requirementTypes.MANDATORY]
  }
});
