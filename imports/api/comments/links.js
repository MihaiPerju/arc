import Users from '/imports/api/users/collection';
import Comments from './collection';

Comments.addLinks({
    author: {
        collection: Users,
        type: 'one',
        field: 'authorId'
    }
});