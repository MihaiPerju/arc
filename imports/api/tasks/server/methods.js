import ActionService from './services/ActionService.js';
import Tasks from '../collection';
import S3 from '/imports/api/s3-uploads/server/s3';
import TaskSecurity from './../security';
import Security from '/imports/api/security/security';
import {roleGroups} from '/imports/api/users/enums/roles';
import Users from '/imports/api/users/collection';

Meteor.methods({
    'task.actions.add'(taskId, actionId) {
        ActionService.createAction(taskId, actionId, this.userId);
    },

    'task.assignee_change'(data) {
        TaskSecurity.hasRightsOnTask(this.userId, data.taskId);
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);

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