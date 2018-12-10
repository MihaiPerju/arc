import EscalationSchema from "./schema.js";

const Escalations = new Mongo.Collection("escalations");

if(Meteor.isServer) {
    Escalations._ensureIndex({clientId: 1, createdAt: 1});
    Escalations._ensureIndex({resolved: 1, resolvedAt: 1});
}

Escalations.attachSchema(EscalationSchema);

export default Escalations;
