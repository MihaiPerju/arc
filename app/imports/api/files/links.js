import Files from './collection.js';
import Facilities from '/imports/api/facilities/collection';

Files.addLinks({
    files: {
        type: 'many',
        collection: Facilities,
        field: 'facilityId'
    }
});