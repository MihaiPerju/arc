import Facilities from './collection.js';
import Clients from "/imports/api/clients/collection.js";
import Users from '/imports/api/clients/collection';

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
        field: 'allowedUserIds'
    }
});