import Facilities from './collection.js';
import Clients from "/imports/api/clients/collection.js";

Facilities.addLinks({
    client: {
        type: 'one',
        collection: Clients,
        field: 'clientId',
        index: true
    }
});