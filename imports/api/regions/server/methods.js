import Regions from '../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'region.create'(data) {
        Security.isAdminOrTech(this.userId);

        Regions.insert(data);
    }
});