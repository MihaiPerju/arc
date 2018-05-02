import TagsSchema from './schemas/schema.js';

const Tags = new Mongo.Collection('tags');

Tags.attachSchema(TagsSchema);

export default Tags;