import Security from '/imports/api/security/security.js';
import ActionService from './services/ActionService.js';
import Tasks from './../collection';

Meteor.methods({
    'task.actions.add'(taskId, actionId) {
        ActionService.createAction(taskId, actionId, this.userId);
    },
    'task.assignee_change'(data) {
        Tasks.update({_id: data.taskId}, {
            $set: {
                assigneeId: data.value
            }
        })
    }
});