import Security from '/imports/api/security/security.js';
import Comments from '/imports/api/comments/collection.js';

Meteor.methods({
    'comment.create'(content, taskId) {
        Security.checkLoggedIn(this.userId);
        const authorId = this.userId;

        Comments.insert({content, taskId, authorId});
    }
});