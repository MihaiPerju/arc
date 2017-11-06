import Actions from '/imports/api/actions/collection.js';

Meteor.methods({
    'action.create'(data) {
        Actions.insert(data);
    },

    'action.edit'(id, {title, description}) {
        Actions.update({_id: id}, {
            $set: {
                title,
                description
            }
        });
    },

    'action.delete'(actionId) {
        Actions.remove({_id: actionId});
    }
});
