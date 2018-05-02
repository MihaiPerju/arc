import Facilities from '../collection';

Facilities.before.insert(function (userId, doc) {
    doc.createdAt = new Date();
});