import Users from '../collection.js';
import userListQuery from '../queries/listUsers.js';
import singleUserQuery from '../queries/singleUser.js';
import userTagsQuery from '../queries/userTags.js';
import listUsersByRole from '../queries/listUsersByRole';
import RolesEnum from '/imports/api/users/enums/roles';

Users.expose({});

userListQuery.expose({});
singleUserQuery.expose({});
listUsersByRole.expose({});
userTagsQuery.expose({
    firewall(userId) {
        if (!Roles.userIsInRole(userId, [RolesEnum.REP])) {
            throw new Meteor.Error('not-rep');
        }
    }
});