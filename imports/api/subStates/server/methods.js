import SubStates from '../collection';
import Security from '/imports/api/security/security';

Meteor.methods({
    'subState.create'(data) {
        Security.checkAdmin(this.userId);

        SubStates.insert(data);
    },
    'subState.update'(data) {
        Security.checkAdmin(this.userId);

        SubStates.update(
            { _id: data._id },
            {
                $set: data
            }
        );
    },
    'subState.deleteMany'(Ids) {
        Security.checkAdmin(this.userId);

        _.each(Ids, (_id) => {
            SubStates.remove({ _id });
        });
    },
});