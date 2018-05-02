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
import Business from '/imports/api/business';
import Files from '/imports/api/files/collection';
import Backup from '/imports/api/backup/collection';
import TaskActions from '/imports/api/taskActions/collection';
import {Substates} from "../enums/substates";
import Actions from "../../actions/collection";

Meteor.methods({
    'task.actions.add'(data) {
        const accountId = data.taskId,
            actionId = data.action,
            reasonId = data.reasonCode,
            userId = this.userId;
            addedBy = data.addedBy;

        ActionService.createAction({accountId, actionId, reasonId, userId, addedBy});
    },

    'account.assignUser'({_id, assigneeId}) {
        TaskSecurity.hasRightsOnTask(this.userId, _id);
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
        Tasks.update(
            {_id},
            {
                $set: {
                    assigneeId
                },
                $unset: {
                    workQueue: null
                }
            }
        );
    },
    'account.assignUser.bulk'({accountIds, assigneeId}) {
        for (let accountId of accountIds) {
            TaskSecurity.hasRightsOnTask(this.userId, accountId);
            Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
            Tasks.update(
                {_id: accountId},
                {
                    $set: {
                        assigneeId
                    },
                    $unset: {
                        workQueue: null
                    }
                }
            );
        }
    },
    'account.assignWorkQueue'({_id, workQueue}) {
        TaskSecurity.hasRightsOnTask(this.userId, _id);
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
        Tasks.update(
            {_id},
            {
                $set: {
                    workQueue
                },
                $unset: {
                    assigneeId: null
                }
            }
        );
    },
    'account.assignWorkQueue.bulk'({accountIds, workQueue}) {
        for (let accountId of accountIds) {
            TaskSecurity.hasRightsOnTask(this.userId, accountId);
            Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
            Tasks.update(
                {_id: accountId},
                {
                    $set: {
                        workQueue
                    },
                    $unset: {
                        assigneeId: null
                    }
                }
            );
        }
    },

    'task.attachment.remove'(_id, attachmentId, key) {
        TaskSecurity.hasRightsOnTask(this.userId, _id);
        Tasks.update(
            {_id},
            {
                $pull: {
                    attachmentIds: attachmentId
                }
            }
        );
        const {path} = Uploads.findOne({_id: attachmentId});
        Uploads.remove({_id: attachmentId});
        fs.unlinkSync(Business.LOCAL_STORAGE_FOLDER + '/' + path);
    },

    'task.attachment.update_order'(_id, attachmentIds) {
        TaskSecurity.hasRightsOnTask(this.userId, _id);
        Tasks.update(
            {_id},
            {
                $set: {
                    attachmentIds
                }
            }
        );
    },

    'tasks.count'() {
        const result = [];
        const facilities = Facilities.find().fetch();
        for (count in facilities) {
            let facility = facilities[count];
            //if user has rights on facility or is an admin/tech

            if (
                (facility.allowedUsers &&
                    facility.allowedUsers.includes(this.userId)) ||
                Roles.userIsInRole(this.userId, roleGroups.ADMIN_TECH)
            ) {
                const active = Tasks.find({
                    state: StateEnum.ACTIVE,
                    facilityId: facility._id
                }).count();
                const archived = Tasks.find({
                    state: StateEnum.ARCHIVED,
                    facilityId: facility._id
                }).count();
                const hold = Tasks.find({
                    state: StateEnum.HOLD,
                    facilityId: facility._id
                }).count();
                let currentMonth = 0;
                let currentWeek = 0;
                //select tasks this month and week. To be optimized.
                const tasks = Tasks.find({facilityId: facility._id}).fetch();
                for (index in tasks) {
                    const task = tasks[index];

                    if (
                        TimeService.sameMonth(moment(task.createdAt), moment())
                    ) {
                        currentMonth++;
                    }
                    if (
                        TimeService.sameWeek(moment(task.createdAt), moment())
                    ) {
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
                });
            }
        }
        return result;
    },

    'tasks.increment_view_count'(_id) {
        Tasks.update({ _id },
            { $inc: { numberOfViews: 1 } }
        );
    },

    'tasks.get'() {
        let result = {
            hold: [],
            active: []
        };

        result.hold = Tasks.find({
            state: StateEnum.HOLD,
            assigneeId: this.userId
        }).count();
        result.active = Tasks.find({
            state: StateEnum.ACTIVE,
            assigneeId: this.userId
        }).count();
        return result;
    },

    'account.tickle'({tickleDate, _id}) {
        Tasks.update({_id}, {
            $set: {
                tickleDate
            }
        })
    },


    'account.escalate'({reason, accountId}) {
        ActionService.createEscalation({reason, _id: accountId, userId: this.userId});
    },

    'reset'() {
        Tasks.remove({});
        TaskActions.remove({});
        Files.remove({});
        Backup.remove({});
    }
});
