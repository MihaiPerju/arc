import Tasks from '/imports/api/tasks/collection';
import Facilities from '/imports/api/facilities/collection';
import Users from '/imports/api/users/collection';
import Clients from '/imports/api/clients/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import TaskActions from '/imports/api/taskActions/collection';

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
    },
    client: {
        type: 'one',
        collection: Clients,
        field: 'acctNum'
    },
    attachments: {
        type: 'many',
        collection: Uploads,
        field: 'attachmentIds'
    },

    actions: {
        type: 'many',
        collection: TaskActions,
        field: 'actionsLinkData'
    }
});