import Tags from '../collection.js';
import Security from '/imports/api/security/security.js';
import Users from '/imports/api/users/collection.js';
import {roleGroups} from '/imports/api/users/enums/roles';

Meteor.methods({
    'tag.create'(data) {
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);

        return Tags.insert(data);
    },

    'tag.delete'(_id) {
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);

        Tags.remove({ _id });
    },
    

    'tag.edit' (id, {client, name}) {
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);

        Tags.update({_id: id}, {
            $set: {
                client,
                name
            }
        });
    },

    'tags.deleteMany' (Ids) {
        Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);

        _.each(Ids, (_id) => {
            Tags.remove({_id});
        });
    }
});
