import Posts from './collection.js';
import Users from '/imports/api/users/collection.js';

export default {
    checkEditPost(userId, postId) {
        const post = Posts.findOne({_id: postId});

        if(post.userId !== userId) {
            throw new Meteor.Error('Not allowed !');
        }
    },

    checkDeletePost(userId, postId) {
        const post = Posts.findOne({_id: postId});

        if(post.userId !== userId) {
            throw new Meteor.Error('Not allowed !');
        }
    }
}