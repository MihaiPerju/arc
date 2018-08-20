import Conditions from '/imports/api/rules/collection.js';

Meteor.methods({
    "condition.create" (data) {
        Conditions.insert(data);
    },

    "condition.update" (data) {
        Conditions.update({
            _id: data._id
        }, {
            $set: data
        });
    }
});