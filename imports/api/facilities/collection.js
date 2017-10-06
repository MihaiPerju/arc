import {Mongo} from 'meteor/mongo';
import FacilitySchema from 'simpl-schema';

const Facilities = new Mongo.Collection('facilities');

Facilities.attachSchema(FacilitySchema);
export default Facilities;
