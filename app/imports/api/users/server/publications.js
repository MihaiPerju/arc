import {Meteor} from 'meteor/meteor';

Meteor.publish(null, function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId}, {
            fields: {
                profile: 1,
                emails: 1,
                avatar: 1
            }
        })
    }
});