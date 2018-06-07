import Facilities from '/imports/api/facilities/collection';
import Clients from "./collection";
import Users from "/imports/api/users/collection";

Clients.addLinks({
    facilities: {
        collection: Facilities,
        type: 'many',
        inversedBy: 'client'
    },
    managers: {
        collection: Users,
        type: 'many',
        field: 'managerIds'
    }
});