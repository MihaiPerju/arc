import Rules from '/imports/api/rules/collection.js';

Meteor.methods({
    "rule.create" (data) {
        Rules.insert(data);
    },

    "rule.update" (data) {
        Rules.update({
            _id: data._id
        }, {
            $set: data
        });
    }
});