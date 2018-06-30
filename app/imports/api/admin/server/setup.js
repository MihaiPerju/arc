import Settings from '/imports/api/settings/collection.js';

Accounts.validateLoginAttempt(function(info){
    var user = info.user;

    if(user) {
        const settings = Settings.findOne();
        const suspendedUserIds = settings.suspendedUserIds || [];

        if(_.contains(suspendedUserIds, user._id)) {
            return false;
        }
    }

    return true;
});