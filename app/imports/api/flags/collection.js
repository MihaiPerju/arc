import FlagSchema from "./schema.js";

const Flags = new Mongo.Collection("flags");

Flags.attachSchema(FlagSchema);

export default Flags;
