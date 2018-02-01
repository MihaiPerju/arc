import insCompanies from '../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'inscompany.create' (data) {
        Security.isAdminOrTech(this.userId);

        insCompanies.insert(data);
    },

    'inscompany.get' (id) {
        Security.isAdminOrTech(this.userId);

        return insCompanies.findOne({_id: id});
    },

    'inscompany.update' (data) {
        Security.isAdminOrTech(this.userId);
        insCompanies.update({_id: data._id}, {
            $set: {
                name: data.name,
                aliases: data.aliases
            }
        });
    },

    'inscompany.delete' (id) {
        Security.isAdminOrTech(this.userId);

        insCompanies.remove({_id: id});
    }

});