import ActionService from './services/ActionService.js';
import Tasks from '../collection';
import S3 from '/imports/api/s3-uploads/server/s3';
import Security from './../security';


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
    },


    'task.attachment.remove'(_id, attachmentId, key) {
        Security.hasRightsOnTask(this.userId, _id);
        Tasks.update({_id}, {
            $pull: {
                attachmentIds: attachmentId
            }
        });

        S3.remove(key);
    },

    'task.attachment.update_order'(_id, attachmentIds) {
        Security.hasRightsOnTask(this.userId, _id);
        Tasks.update({_id}, {
            $set: {
                attachmentIds

            }
        })
    }
});