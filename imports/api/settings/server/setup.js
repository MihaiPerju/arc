import Settings from '../collection.js';

Meteor.startup(function () {
    const settings = Settings.findOne();

    if (!settings) {
        Settings.insert({});
    }
});