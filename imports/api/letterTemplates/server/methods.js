import Security from '/imports/api/security/security.js';
import LetterTemplates from '/imports/api/letterTemplates/collection';

Meteor.methods({
    'letterTemplate.create'(data) {
        Security.checkAllowedModifyClient(this.userId);

        return LetterTemplates.insert(data);
    },

    'letterTemplate.update'(data) {
        Security.checkAllowedModifyClient(this.userId);

        LetterTemplates.update({_id: data.id}, {
            $set: data
        })
    },

    'letterTemplate.get'(id) {
        Security.checkAllowedModifyClient(this.userId);

        return LetterTemplates.findOne({_id: id});
    },

    'letterTemplate.delete'(id) {
        Security.checkAllowedModifyClient(this.userId);

        LetterTemplates.remove({_id: id});
    }

});