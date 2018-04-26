import SubStatesSchema from './schemas/schema.js'

const SubStates = new Mongo.Collection('sub_states');

SubStates.attachSchema(SubStatesSchema);

export default SubStates;