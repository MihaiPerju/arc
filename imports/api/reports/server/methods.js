import Reports from './../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'report.delete'(id) {
        Security.isAdminOrTech(this.userId);

        Reports.remove({_id: id});
    },

    'report.create'(data) {
        Security.isAdminOrTech(this.userId);

        Reports.insert(data);
    },

    'report.getById'(_id) {
        Security.isAdminOrTech(this.userId);

        return Reports.findOne({_id});
    },

    'report.update'(data, _id) {
        Security.isAdminOrTech(this.userId);

        return Reports.update({_id}, {
            $set: data
        });
    }
});