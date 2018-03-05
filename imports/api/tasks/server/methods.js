import ActionService from './services/ActionService.js';
import Tasks from '../collection';
import TaskSecurity from './../security';
import Security from '/imports/api/security/security';
import {roleGroups} from '/imports/api/users/enums/roles';
import StateEnum from '/imports/api/tasks/enums/states';
import TimeService from './services/TimeService';
import moment from 'moment';
import Facilities from '/imports/api/facilities/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import fs from 'fs';
import os from 'os';
import FolderConfig from '/imports/api/business';

Meteor.methods({
    'task.actions.add'(data) {
        const taskId = data.taskId,
              actionId = data.action,
              reasonId = data.reasonCode,
              userId = this.userId;

        ActionService.createAction({taskId, actionId, reasonId, userId});
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
        TaskSecurity.hasRightsOnTask(this.userId, _id);
        Tasks.update({_id}, {
            $pull: {
                attachmentIds: attachmentId
            }
        });
        const {path} = Uploads.findOne({_id: attachmentId});
        Uploads.remove({_id: attachmentId});
        fs.unlinkSync(os.tmpDir() + FolderConfig.LOCAL_STORAGE_FOLDER + '/' + path);
    },

    'task.attachment.update_order'(_id, attachmentIds) {
        TaskSecurity.hasRightsOnTask(this.userId, _id);
        Tasks.update({_id}, {
            $set: {
                attachmentIds
            }
        })
    },

    'tasks.count'() {
        const result = [];
        const facilities = Facilities.find().fetch();
        for (count in facilities) {
            let facility = facilities[count];
            //if user has rights on facility or is an admin/tech

            if (facility.allowedUsers && facility.allowedUsers.includes(this.userId) || Roles.userIsInRole(this.userId, roleGroups.ADMIN_TECH)) {
                const active = Tasks.find({state: StateEnum.ACTIVE, facilityId: facility._id}).count();
                const archived = Tasks.find({state: StateEnum.ARCHIVED, facilityId: facility._id}).count();
                const hold = Tasks.find({state: StateEnum.HOLD, facilityId: facility._id}).count();
                let currentMonth = 0;
                let currentWeek = 0;
                //select tasks this month and week. To be optimized.
                const tasks = Tasks.find({facilityId: facility._id}).fetch();
                for (index in tasks) {
                    const task = tasks[index];

                    if (TimeService.sameMonth(moment(task.createdAt), moment())) {
                        currentMonth++;
                    }
                    if (TimeService.sameWeek(moment(task.createdAt), moment())) {
                        currentWeek++;
                    }
                }
                result.push({
                    name: facility.name,
                    active,
                    archived,
                    hold,
                    currentMonth,
                    currentWeek
                })
            }
        }
        return result;
    },

    'tasks.get'() {
        let result = {
            hold: [],
            active: []
        };

        result.hold = Tasks.find({state: StateEnum.HOLD, assigneeId: this.userId}).count();
        result.active = Tasks.find({state: StateEnum.ACTIVE, assigneeId: this.userId}).count();
        return result;

    }
});