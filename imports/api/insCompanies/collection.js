import insCompaniesSchema from './schemas/schema.js'

const insCompanies = new Mongo.Collection('insCompanies');

insCompanies.attachSchema(insCompaniesSchema);

export default insCompanies;