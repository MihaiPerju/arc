import Reports from './../collection';
import reportsQuery from './../queries/reportsList';
import {roleGroups} from '/imports/api/users/enums/roles';

reportsQuery.expose({
    firewall(userId, params) {
        if (Roles.userIsInRole(userId, roleGroups.ADMIN_TECH_MANAGER)) {
            const user = Meteor.user();
            const userRole = user.roles[0];

            if (!Roles.userIsInRole(userId, roleGroups.ADMIN_TECH)) {
                _.extend(params, {
                    filters: {
                        $or: [{allowedRoles: {'$in': [userRole]}}, {createdBy: user._id}]
                    }
                });
            }

        } else {
            throw new Meteor.Error('Not allowed', "You don't have necessary rights to access reports");
        }
    }
});
Reports.expose({});