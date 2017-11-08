import Tasks from '/imports/api/tasks/collection';
import Facilities from '/imports/api/facilities/collection';

Tasks.addLinks({
    facility: {
        type: 'one',
        collection: Facilities,
        field: 'facilityId'
    }
});