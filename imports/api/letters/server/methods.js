import {Meteor} from 'meteor/meteor';
import Security from '/imports/api/security/security.js';
import {roleGroups} from '/imports/api/users/enums/roles';
import Letters from '../collection.js';

Meteor.methods({
    'letter.create'(data) {
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
        Letters.insert(data);
    },

    'letter.get' (letterId) {
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
        return Letters.findOne(letterId);
    },

    'letter.delete'(letterId) {
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
        Letters.remove(letterId);
    },
});