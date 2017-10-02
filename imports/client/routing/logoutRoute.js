import { FlowRouter } from 'meteor/kadira:flow-router';
import Notifier from '/imports/client/lib/Notifier';

FlowRouter.route('/logout', {
    action() {
        Meteor.logout((err) => {
            if (err) {
                Notifier.error("An error has occurred please try again");
            } else {
                Notifier.success('Successfully logged out');
                FlowRouter.go('');
            }
        })
    },
    name: 'logout'
});