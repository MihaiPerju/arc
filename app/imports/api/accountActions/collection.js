import AccountActionsSchema from './schema.js'

const AccountActions = new Mongo.Collection('account_actions');

AccountActions.attachSchema(AccountActionsSchema);

export default AccountActions;