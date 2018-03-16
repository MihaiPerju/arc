import AccountSchema from '/imports/api/tasks/schema.js'

const Backup = new Mongo.Collection('backup');

Backup.attachSchema(AccountSchema);

export default Backup;