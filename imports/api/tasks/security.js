import Facilities from '/imports/api/facilities/collection.js';
import Tasks from '/imports/api/tasks/collection';
import {roleGroups} from '/imports/api/users/enums/roles';

export default {
    hasRightsOnTask(userId, taskId) {
        if (Roles.userIsInRole(userId, roleGroups.ADMIN_TECH)) {
            return true;
        }

        const task = Tasks.findOne({_id: taskId});
        const facilityId = task && task.facilityId;
        const facility = Facilities.findOne({_id: facilityId});

        return facility && facility.allowedUsers && facility.allowedUsers.includes(userId)
    }
}