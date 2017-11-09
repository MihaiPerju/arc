import Tasks from '/imports/api/tasks/collection';
import Facilities from '/imports/api/facilities/collection';
import Users from '/imports/api/users/collection';

Tasks.addLinks({
    facility: {
        type: 'one',
        collection: Facilities,
        field: 'facilityId'
    },
    assignee: {
        type: 'one',
        collection: Users,
        field: 'assigneeId'
    }
});