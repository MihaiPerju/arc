import TickleSchema from "./schema.js";

const Tickles = new Mongo.Collection("tickles");

Tickles.attachSchema(TickleSchema);

export default Tickles;
