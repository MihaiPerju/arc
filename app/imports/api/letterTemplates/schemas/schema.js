import SimpleSchema from "simpl-schema";
import CATEGORIES, {
  CategoryList
} from "/imports/api/letterTemplates/enums/categories.js";

export default new SimpleSchema({
  name: {
    type: String
  },
  body: {
    type: String
  },
  category: {
    type: String,
    allowedValues: CategoryList
  },
  description: {
    type: String,
    optional: true
  },
  keywords: {
    type: Array,
    optional: true
  },
  "keywords.$": {
    type: String
  },
  createdAt: {
    type: Date,
    optional: true
  },
  codeIds: {
    label: "CARC/RARC codes",
    type: Array,
    optional: true
  },
  "codeIds.$": {
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
