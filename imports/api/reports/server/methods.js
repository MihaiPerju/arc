import Reports from './../collection.js';
import Security from '/imports/api/reports/security.js';
import {Email} from 'meteor/email'

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

    'report.update'(data) {
        // Check if user is allowed to modify report;
        Security.hasRightsOnReport(this.userId, data.reportId);

        return Reports.update({_id: data.reportId}, {
            $set: data.generalInformation
        });
    }
});