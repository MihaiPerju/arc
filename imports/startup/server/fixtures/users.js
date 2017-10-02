import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import faker from 'faker';

const createUser = (email, password, roles) => {
    const userId = Accounts.createUser({email, password});

    if (roles) {
        Roles.addUsersToRoles(userId, roles);
    }

    Meteor.users.update(userId, {
        $set: {
            profile: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        }
    });

    return Meteor.users.findOne(userId);
};

Meteor.startup(function () {
    if (Meteor.users.find().count() > 0) {
        return true;
    }

    createUser('admin@app.com', '12345', 'ADMIN');
    createUser('user-1@app.com', '12345');
    createUser('user-2@app.com', '12345');
    createUser('user-3@app.com', '12345');
    createUser('user-4@app.com', '12345');
    createUser('user-5@app.com', '12345');

    console.log('[ok] user fixtures have been loaded.');
});