import Users from '../collection.js';
import userListQuery from '../queries/listUsers.js';
import singleUserQuery from '../queries/singleUser.js';
import listUsersByRole from '../queries/listUsersByRole';

Users.expose({});

userListQuery.expose({});
singleUserQuery.expose({});
listUsersByRole.expose({});