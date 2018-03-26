import Facilities from './collection.js';
import Clients from "/imports/api/clients/collection.js";
import Users from '/imports/api/users/collection';
import Tasks from '/imports/api/tasks/collection';
import Regions from '/imports/api/regions/collection';

Facilities.addLinks({
    client: {
        type: 'one',
        collection: Clients,
        field: 'clientId',
        index: true
    },
    users: {
        type: 'many',
        collection: Users,
        field: 'allowedUsers'
    },
    tasks: {
        collection: Tasks,
        type: 'many',
        inversedBy: 'facility'
    },
    region: {
        collection: Regions,
        type: 'one',
        field: 'regionId'
    }
});