import {Mongo} from 'meteor/mongo';
import FacilitySchema from "./schema.js";

const Facilities = new Mongo.Collection('facilities');

Facilities.attachSchema(FacilitySchema);
export default Facilities;
