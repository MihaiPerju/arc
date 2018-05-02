import Facilities from '/imports/api/facilities/collection';
import Clients from "./collection";

Clients.addLinks({
    facilities: {
        collection: Facilities,
        type: 'many',
        inversedBy: 'client'
    }
});