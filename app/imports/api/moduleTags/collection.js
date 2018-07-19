import ModuleTagsSchema from "./schema.js";

const moduleTags = new Mongo.Collection("module_tags");

moduleTags.attachSchema(ModuleTagsSchema);

export default moduleTags;
