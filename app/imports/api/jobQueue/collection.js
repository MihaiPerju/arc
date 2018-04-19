import { Mongo } from "meteor/mongo";
import JobQueueSchema from "./schema";

const JobQueue = new Mongo.Collection("jobQueue");
JobQueue.attachSchema(JobQueueSchema);

export default JobQueue;
