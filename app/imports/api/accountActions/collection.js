import AccountActionsSchema from './schema.js'

const AccountActions = new Mongo.Collection('account_actions');

if(Meteor.isServer) {
    AccountActions._ensureIndex({type: 1, clientId: 1, createdAt: 1});
}

AccountActions.attachSchema(AccountActionsSchema);

export default AccountActions;