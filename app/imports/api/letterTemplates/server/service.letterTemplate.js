import LetterTemplates from '/imports/api/letterTemplates/collection';
import _ from "underscore";
import Parser from "simple-text-parser";

class LetterTemplateService {
    constructor() {
        this.parser = new Parser();
    }

    async addLetterTemplate(data) {
        data.keywords = await this.getTemplateBodyKeywords(data.body);
        LetterTemplates.insert(data);
    }

    async updateLetterTemplate(data) {
        data.keywords = await this.getTemplateBodyKeywords(data.body);
        LetterTemplates.update({_id: data._id}, {
            $set: data
        })
    }

    getTemplateBodyKeywords(body) {
        this.parser.addRule(/{(.*?)}/g, (tag) => {
            const word = tag.substring(1).slice(0, -1);
            return {type: "tag", word};
        });

        const resObj = this.parser.toTree(body);

        const keywords = [];
        _.each(resObj, (obj) => {
            if (obj.word) {
                keywords.push(obj.word);
            }
        });
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
