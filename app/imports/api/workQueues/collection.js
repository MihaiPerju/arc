import WorkQueuesSchema from "./schemas/schema.js";

const WorkQueues = new Mongo.Collection("workQueues");

WorkQueues.attachSchema(WorkQueuesSchema);

export default WorkQueues;
