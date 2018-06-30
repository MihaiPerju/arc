import InsuranceCompanies from '../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'inscompany.create' (data) {
        Security.isAdminOrTech(this.userId);

        InsuranceCompanies.insert(data);
    },

    'inscompany.get' (id) {
        Security.isAdminOrTech(this.userId);

        return InsuranceCompanies.findOne({_id: id});
    },

    'inscompany.update' (data) {
        Security.isAdminOrTech(this.userId);
        InsuranceCompanies.update({_id: data._id}, {
            $set: {
                name: data.name,
                aliases: data.aliases
            }
        });
    },

    'inscompany.delete' (id) {
        Security.isAdminOrTech(this.userId);

        InsuranceCompanies.remove({_id: id});
    }

});