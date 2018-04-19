import Posts from '../collection.js';
import Security from '/imports/api/security/security.js';
import PostSecurity from '../security.js';

Meteor.methods({
    'post.create'(data) {
        Security.checkLoggedIn(this.userId);
        data.userId = this.userId;

        return Posts.insert(data);
    },

    'post.edit'(postId, data) {
        Security.checkLoggedIn(this.userId);
        PostSecurity.checkEditPost(this.userId, postId);

        return Posts.update({_id: postId}, {
            $set: data
        });
    },

    'post.delete'(postId) {
        Security.checkLoggedIn(this.userId);
        PostSecurity.checkDeletePost(this.userId, postId);

        return Posts.remove({_id: postId});
    }
});