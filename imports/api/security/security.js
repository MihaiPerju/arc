import Users from '/imports/api/users/collection.js';
import _ from 'underscore';

export default {
    checkAdmin(userId) {
        this.checkLoggedIn(userId);

        const user = Users.findOne({_id: userId});

        if (!_.contains(user.roles, 'ADMIN')) {
            throw new Meteor.Error('Not allowed !');
        }
    },

    checkLoggedIn(userId) {
        if (!userId) {
            throw new Meteor.Error('Not logged in !');
        }
    }
}