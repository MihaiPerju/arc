import Actions from '../collection.js';

Meteor.methods({
    'action.create'(data) {
        Actions.insert(data);
    },

    'action.edit'(actionId, data) {
        Actions.update({_id: actionId}, {
            $set: data
        });
    },

    'action.delete'(actionId) {
        Actions.remove({_id: actionId});
    }
});