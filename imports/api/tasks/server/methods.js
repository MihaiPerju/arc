import ActionService from './services/ActionService.js';
import Tasks from '../collection';
import S3 from '/imports/api/s3-uploads/server/s3';

Meteor.methods({
    'task.actions.add'(taskId, actionId) {
        ActionService.createAction(taskId, actionId, this.userId);
    },

    'task.attachment.remove'(_id, attachmentId, key) {
        Tasks.update({_id}, {
            $pull: {
                attachmentIds: attachmentId
            }
        });

        S3.remove(key);
    },

    'task.attachment.update_order'(_id, attachmentIds) {
        Tasks.update({_id}, {
            $set: {
                attachmentIds
            }
        })
    }
});