import {Mongo} from 'meteor/mongo';
import FacilitySchema from "./schema.js";

const Facilities = new Mongo.Collection('facilities');

if(Meteor.isServer) {
    Facilities._ensureIndex({allowedUsers: 1});
}

Facilities.attachSchema(FacilitySchema);
export default Facilities;
