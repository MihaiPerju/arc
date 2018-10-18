import { Mongo } from "meteor/mongo";
import JobQueueSchema from "./schema";

const JobQueue = new Mongo.Collection("jobQueue");

if(Meteor.isServer) {
    JobQueue._ensureIndex({workerId: 1, fileType: 1});
    JobQueue._ensureIndex({type: 1});
}

JobQueue.attachSchema(JobQueueSchema);

export default JobQueue;
