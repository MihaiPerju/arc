import InsuranceCompaniesSchema from './schemas/schema.js'

const InsuranceCompanies = new Mongo.Collection('insurance_companies');

InsuranceCompanies.attachSchema(InsuranceCompaniesSchema);

export default InsuranceCompanies;