import Security from '/imports/api/security/security.js';
import LetterTemplates from '/imports/api/letterTemplates/collection';

Meteor.methods({
    'letterTemplate.create'(data) {
        Security.checkAllowedModifyClient(this.userId);

        return LetterTemplates.insert(data);
    },

    'letterTemplate.update'({id, name, content}) {
        Security.checkAllowedModifyClient(this.userId);

        LetterTemplates.update({_id: id}, {
            $set: {
                name,
                content
            }
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