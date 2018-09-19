import RuleSchema from './schemas/schema.js'

const Rules = new Mongo.Collection('rules');

Rules.attachSchema(RuleSchema);

export default Rules;