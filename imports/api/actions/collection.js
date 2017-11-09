import ActionSchema from './schemas/schema.js'

const Actions = new Mongo.Collection('actions');

Actions.attachSchema(ActionSchema);

export default Actions;