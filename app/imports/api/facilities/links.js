import Facilities from './collection.js';
import Clients from "/imports/api/clients/collection.js";
import Users from '/imports/api/users/collection';
import Accounts from '/imports/api/accounts/collection';
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
    accounts: {
        collection: Accounts,
        type: 'many',
        inversedBy: 'facility'
    },
    region: {
        collection: Regions,
        type: 'one',
        field: 'regionId'
    }
});