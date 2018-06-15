import EscalationSchema from "./schema.js";

const Escalations = new Mongo.Collection("escalations");

Escalations.attachSchema(EscalationSchema);

export default Escalations;
