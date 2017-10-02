import Users from '../collection.js';
import userListQuery from '../queries/listUsers.js';
import singleUserQuery from '../queries/singleUser.js';

Users.expose({});

userListQuery.expose({});
singleUserQuery.expose({});