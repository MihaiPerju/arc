import Letters from '../collection';

Letters.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});