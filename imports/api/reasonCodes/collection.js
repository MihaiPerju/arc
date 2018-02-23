import ReasonCodesSchema from './schema.js'

const ReasonCodes = new Mongo.Collection('reasonCodes');

ReasonCodes.attachSchema(ReasonCodesSchema);

export default ReasonCodes;