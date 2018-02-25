import LetterTemplates from '/imports/api/letterTemplates/collection';
import _ from "underscore";
import Parser from "simple-text-parser";

class LetterTemplateService {
    constructor() {
        this.parser = new Parser();
    }

    addLetterTemplate (data) {
        data.keywords = this.getTemplateBodyKeywords(data.body);
        LetterTemplates.insert(data);
    }

    updateLetterTemplate (data) {
        data.keywords = this.getTemplateBodyKeywords(data.body);
        LetterTemplates.update({_id: data.id}, {
            $set: data
        })
    }

    getTemplateBodyKeywords (body) {
        let keywords = [];

        this.parser.addRule(/<code>(.*?)<\/code>/g, function(tag) {
            const word = tag.substring(6).slice(0, -7);
            keywords.push(word);
        });

        this.parser.render(body);
        return _.unique(keywords);
    }

    getLetterTemplates() {
        return LetterTemplates.find({}, {
            fields: {
                name: 1,
                body: 1,
                description: 1,
                keywords: 1,
                codeIds: 1
            }
        }).fetch();
    }
}

export default new LetterTemplateService();
export {LetterTemplateService}
