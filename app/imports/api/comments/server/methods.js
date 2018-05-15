import Security from '/imports/api/security/security.js';
import Comments from '/imports/api/comments/collection.js';

Meteor.methods({
    'comment.create'(content, accountId) {
        Security.checkLoggedIn(this.userId);
        const authorId = this.userId;

        Comments.insert({content, accountId, authorId});
    }
});