import Security from '/imports/api/security/security.js';
import ActionService from './services/ActionService.js';

Meteor.methods({
    'task.actions.add'(taskId, actionId) {
        ActionService.createAction(taskId, actionId, this.userId);
    }
});