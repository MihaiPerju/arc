import SubstatesSchema from './schemas/schema.js'

const Substates = new Mongo.Collection('substates');

Substates.attachSchema(SubstatesSchema);

export default Substates;