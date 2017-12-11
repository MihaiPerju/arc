import Reports from '/imports/api/reports/collection.js';
import {roleGroups} from '/imports/api/users/enums/roles';

export default {
    hasRightsOnReport(userId, _id) {
        const report = Reports.findOne({_id});
        if (!Roles.userIsInRole(userId, roleGroups.ADMIN_TECH) && report.createdBy == userId) {
            throw new Meteor.Error('not-allowed', 'You do not have the correct roles for this!');
        }
    }
}