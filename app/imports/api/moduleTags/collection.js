import ModuleTagsSchema from "./schema.js";

const ModuleTags = new Mongo.Collection("module_tags");

ModuleTags.attachSchema(ModuleTagsSchema);

export default ModuleTags;
