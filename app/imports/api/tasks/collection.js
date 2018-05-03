import TaskSchema from './schema.js'

const Tasks = new Mongo.Collection('tasks');

Tasks.attachSchema(TaskSchema);

export default Tasks;