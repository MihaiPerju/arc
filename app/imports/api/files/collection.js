import FileSchema from './schemas/schema.js'

const Files = new Mongo.Collection('files');

Files.attachSchema(FileSchema);

export default Files;