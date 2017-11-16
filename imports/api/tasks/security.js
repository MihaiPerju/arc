import Facilities from '/imports/api/facilities/collection.js';
import Tasks from '/imports/api/tasks/collection';

export default {
    allowedUploadPdf(userId, taskId) {
        const task = Tasks.findOne({_id: taskId});
        const facilityId = task && task.facilityId;
        const facility = Facilities.findOne({_id: facilityId});

        return facility && facility.allowedUsers && facility.allowedUsers.includes(userId)
    }
}