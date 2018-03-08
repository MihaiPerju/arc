import Reports from './../collection';
import reportsQuery from './../queries/reportsList';
import {roleGroups} from '/imports/api/users/enums/roles';

reportsQuery.expose({
    firewall(userId, params) {
        if (Roles.userIsInRole(userId, roleGroups.ADMIN_TECH_MANAGER)) {

            const userRoles = Roles.getRolesForUser(userId);
            if (!Roles.userIsInRole(userId, roleGroups.ADMIN_TECH)) {
                _.extend(params, {
                    filters: {
                        $or: [{allowedRoles: {'$in': [userRoles]}}, {createdBy: userId}]
                    }
                });
            }

        } else {
            throw new Meteor.Error('Not allowed', "You don't have necessary rights to access reports");
        }
    }
});
Reports.expose({});