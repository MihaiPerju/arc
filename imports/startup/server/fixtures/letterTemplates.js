import _ from "underscore";
import LetterTemplates from '/imports/api/letterTemplates/collection';
import {CategoryList} from "/imports/api/letterTemplates/enums/categories.js";
import Counter, {LETTER_BODY_TEMPLATES} from './config';
import {LetterTemplateService} from '/imports/api/letterTemplates/server/service.letterTemplate.js';

Meteor.startup(function () {
    if (LetterTemplates.find().count() > 0) {
        return true;
    }

    for (let i = 0; i < Counter.LETTER_TEMPLATES; i++) {
        const letterTemplateService = new LetterTemplateService;
        letterTemplateService.addLetterTemplate({
            name: `letter-${i + 1}`,
            body: LETTER_BODY_TEMPLATES[i],
            category: _.sample(CategoryList),
            description: `letter-${i + 1} description`
        })
    }

    console.log('[ok] letterTemplate fixtures have been loaded.');
});