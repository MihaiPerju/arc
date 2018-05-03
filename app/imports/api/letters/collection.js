import {Mongo} from "meteor/mongo";
import LetterSchema from './schemas/schema.js';

const Letters = new Mongo.Collection('letters');

Letters.attachSchema(LetterSchema);

export default Letters;