import Reports from './../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'report.delete'(id) {
        Security.isAdminOrTech(this.userId);

        Reports.remove({_id: id});
    },
});