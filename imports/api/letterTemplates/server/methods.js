import Security from '/imports/api/security/security.js';
import LetterTemplates from '/imports/api/letterTemplates/collection';
import LetterTemplateService from './service.letterTemplate.js';
import UserRoles from '/imports/api/users/enums/roles';

Meteor.methods({
    'manager.letterTemplates.get'() {
        //Security.isAllowed(this.userId, [UserRoles.MANAGER]);
        return LetterTemplateService.getLetterTemplates();
    },

    'letterTemplate.create'(data) {
        Security.isAdminOrTech(this.userId);
        return LetterTemplateService.addLetterTemplate(data);
    },

    'letterTemplate.update'(data) {
        Security.isAdminOrTech(this.userId);
        LetterTemplateService.updateLetterTemplate(data);
    },

    'letterTemplate.get'(id) {
        Security.isAdminOrTech(this.userId);
        return LetterTemplates.findOne({_id: id});
    },

    'letterTemplate.delete'(id) {
        Security.isAdminOrTech(this.userId);
        LetterTemplates.remove({_id: id});
    }
});