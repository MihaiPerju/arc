import Posts from '../collection.js';
import Users from '/imports/api/users/collection.js';

Posts.addLinks({
    user: {
        type: 'one',
        collection: Users,
        field: 'userId',
        index: true
    }
});