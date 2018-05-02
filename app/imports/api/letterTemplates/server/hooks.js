import LetterTemplates from '../collection';

LetterTemplates.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});