import TaskActionsSchema from './schema.js'

const TaskActions = new Mongo.Collection('task_actions');

TaskActions.attachSchema(TaskActionsSchema);

export default TaskActions;