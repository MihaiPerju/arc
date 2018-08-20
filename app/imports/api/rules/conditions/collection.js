import ConditionSchema from './schemas/schema.js'

const Conditions = new Mongo.Collection('conditions');

Conditions.attachSchema(ConditionSchema);

export default Conditions;