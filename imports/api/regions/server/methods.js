import Regions from '../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'region.create'(data) {
        Security.isAdminOrTech(this.userId);

        Regions.insert(data);
    },

    'region.get'(id) {
        Security.isAdminOrTech(this.userId);

        return Regions.findOne({_id: id});
    },

    'region.update'({_id, name}) {
        Security.isAdminOrTech(this.userId);

        Regions.update({_id}, {
            $set: {
                name
            }
        });
    }
});