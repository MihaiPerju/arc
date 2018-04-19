import SettingsSchema from './schema.js'

const Settings = new Mongo.Collection('settings');

Settings.attachSchema(SettingsSchema);

export default Settings;