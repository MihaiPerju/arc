import Substates from '../collection';
import Security from '/imports/api/security/security';

Meteor.methods({
    'substate.create'(data) {
        Security.checkAdmin(this.userId);

        Substates.insert(data);
    },
    'substate.update'(data) {
        Security.checkAdmin(this.userId);

        Substates.update(
            { _id: data._id },
            {
                $set: data
            }
        );
    },
    'substate.deleteMany'(Ids) {
        Security.checkAdmin(this.userId);

        _.each(Ids, (_id) => {
            Substates.remove({ _id });
        });
    },
});