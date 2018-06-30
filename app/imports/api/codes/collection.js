import CodesSchema from './schemas/schema.js'

const Codes = new Mongo.Collection('codes');

Codes.attachSchema(CodesSchema);

export default Codes;