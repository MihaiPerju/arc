import AccountSchema from './schema.js'

const Accounts = new Mongo.Collection('accounts');

if(Meteor.isServer) {
    Accounts._ensureIndex({assigneeId: 1});
    Accounts._ensureIndex({workQueueId: 1});
    Accounts._ensureIndex({isPending: 1});
}

Accounts.attachSchema(AccountSchema);

export default Accounts;