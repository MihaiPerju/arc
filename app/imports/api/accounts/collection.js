import AccountSchema from './schema.js'

const Accounts = new Mongo.Collection('accounts');

Accounts.attachSchema(AccountSchema);

export default Accounts;