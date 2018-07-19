import ModuleTagsSchema from "./schema.js";

const moduleTags = new Mongo.Collection("moduleTags");

moduleTags.attachSchema(ModuleTagsSchema);

export default moduleTags;
