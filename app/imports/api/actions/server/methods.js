import Actions from '/imports/api/actions/collection.js';

Meteor.methods({
    'action.create'(data) {
        Actions.insert(data);
    },

    'action.edit'(id, {title, description, substate, inputs}) {
        Actions.update({_id: id}, {
            $set: {
                title,
                description,
                substate,
                inputs
            }
        });
    },

    'action.delete'(actionId) {
        Actions.remove({_id: actionId});
    },

    'action.deleteMany'(Ids) {
        _.each(Ids, (_id) => {
            Actions.remove({_id});
        });
    }
});
