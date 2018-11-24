import Security from "/imports/api/security/security.js";
import LetterTemplates from "/imports/api/letterTemplates/collection";
import LetterTemplateService from "./service.letterTemplate.js";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";

Meteor.methods({
  "templates.get"(params) {
    const queryParams = QueryBuilder.getTemplatesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    options.fields = { tagIds: 1, name: 1 };
    return LetterTemplates.find(filters, options).fetch();
  },

  "templates.count"(params) {
    const queryParams = QueryBuilder.getTemplatesParams(params);
    let filters = queryParams.filters;
    return LetterTemplates.find(filters).count();
  },

  "template.getOne"(_id) {
    return LetterTemplates.findOne({ _id });
  },

  "letterTemplates.get"() {
    return LetterTemplateService.getLetterTemplates();
  },

  "letterTemplate.create"(data) {
    Security.isAdminOrTech(this.userId);
    return LetterTemplateService.addLetterTemplate(data);
  },

  "letterTemplate.update"(data) {
    Security.isAdminOrTech(this.userId);
    LetterTemplateService.updateLetterTemplate(data);
  },

  "letterTemplate.get"(id) {
    Security.isAdminOrTech(this.userId);
    return LetterTemplates.findOne({ _id: id });
  },

  "letterTemplate.delete"(id) {
    Security.isAdminOrTech(this.userId);
    LetterTemplates.remove({ _id: id });
  },

  "letterTemplate.deleteMany"(ids) {
    Security.isAdminOrTech(this.userId);

    LetterTemplates.remove({ _id: { $in: ids } });
  },

  "letterTemplate.tag"({ _id, tagIds }) {
    LetterTemplates.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
