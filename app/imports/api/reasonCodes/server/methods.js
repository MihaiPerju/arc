import ReasonCodes from '../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'reasonCode.create'(data) {
        Security.checkLoggedIn(this.userId);

        return ReasonCodes.insert(data);
    },

    'reasonCode.edit'(data) {
        Security.checkLoggedIn(this.userId);

        return ReasonCodes.update({_id: data._id}, {
            $set: data
        });
    },

    'reasonCode.delete'(_id) {
        Security.checkLoggedIn(this.userId);

        return ReasonCodes.remove({_id});
    }
});