import {Meteor} from 'meteor/meteor';
import Security from '/imports/api/security/security.js';
import UserRoles from '/imports/api/users/enums/roles';
import Letters from '../collection.js';

Meteor.methods({
    'letter.create'(data) {
        //Security.isAllowed(this.userId, UserRoles.MANAGER);
        Letters.insert(data);
    },

    'letter.delete'(letterId) {
        //Security.isAllowed(this.userId, UserRoles.MANAGER);
        Letters.remove(letterId);
    },
});