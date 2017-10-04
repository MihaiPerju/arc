import Users from '/imports/api/users/collection.js';
import _ from 'underscore';
import UserRoles from '/imports/api/users/enums/roles';

export default {
    checkAdmin(userId) {
        this.checkLoggedIn(userId);

        const user = Users.findOne({_id: userId});

        if (!_.contains(user.roles, UserRoles.ADMIN)) {
            throw new Meteor.Error('Not allowed !');
        }
    },

    checkLoggedIn(userId) {
        if (!userId) {
            throw new Meteor.Error('Not logged in !');
        }
    },

    checkAllowedModifyClient(userId) {
        this.checkLoggedIn(userId);

        if (!Roles.userIsInRole(userId, [UserRoles.ADMIN, UserRoles.TECH])) {
            throw new Meteor.Error('Not allowed !');
        }
    }
}