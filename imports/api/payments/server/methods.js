import Payments from '../collection.js';
import Security from '/imports/api/security/security.js';

Meteor.methods({
    'payment.add'(data) {
        Security.checkLoggedIn(this.userId);

        Payments.insert(data);
    }
});