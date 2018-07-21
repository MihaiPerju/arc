import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  name: {
    type: String
  },
  mongoFilters: {
    type: String,
    optional: true
  },
  filterBuilderData: {
    type: Object,
    blackbox: true,
    optional: true
  },
  shareReport: {
    type: Boolean,
    optional: true
  },
  authorId: {
    type: String,
    optional: true
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  },
  type: {
    type: String
  }
});
