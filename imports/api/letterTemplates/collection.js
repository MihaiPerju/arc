import LetterTemplatesSchema from './schemas/schema.js'

const LetterTemplates = new Mongo.Collection('letter_templates');

LetterTemplates.attachSchema(LetterTemplatesSchema);

export default LetterTemplates;