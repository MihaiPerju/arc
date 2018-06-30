import Users from './collection.js';
import Tags from '/imports/api/tags/collection';

Users.addLinks({
    tags: {
        collection: Tags,
        type: 'many',
        field: 'tagIds'
    }
});

Users.addReducers({
});