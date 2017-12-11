import Reports from './../collection.js';
import Security from '/imports/api/reports/security.js';

Meteor.methods({
    'report.delete'(id) {
        Security.hasRightsOnReport(this.userId, id);

        Reports.remove({_id: id});
    },

    'report.create'(data) {
        data.createdBy = this.userId;

        Reports.insert(data);
    },

    'report.getById'(_id) {
        Security.hasRightsOnReport(this.userId, _id);

        return Reports.findOne({_id});
    },

    'report.update'(data, _id) {
        // Check if user is allowed to modify report;
        Security.hasRightsOnReport(this.userId, _id);

        return Reports.update({_id}, {
            $set: data
        });
    }
});