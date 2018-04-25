import Tags from '../collection.js';
import Security from '/imports/api/security/security.js';
import Users from '/imports/api/users/collection.js';
import {roleGroups} from '/imports/api/users/enums/roles';

Meteor.methods({
    'tag.create'(data) {
        Security.isAllowed(this.userId, roleGroups.MANAGER);

        return Tags.insert(data);
    },

    'tag.delete'(_id) {
        Security.isAllowed(this.userId, roleGroups.MANAGER);

        Tags.remove({ _id });
    },
    

    'tag.edit' (id, {client, name}) {
        Security.isAllowed(this.userId, roleGroups.MANAGER);

        Tags.update({_id: id}, {
            $set: {
                client,
                name
            }
        });
    },

    'tags.deleteMany' (Ids) {
        Security.isAllowed(this.userId, roleGroups.MANAGER);

        _.each(Ids, (_id) => {
            Tags.remove({_id});
        });
    },

    'tag.addTag'({_id, tagId}) {
        Security.isAllowed(this.userId, roleGroups.MANAGER);

        Users.update(
            {_id},
            {$push: {tagIds: tagId}}
        )
    },

    'tag.removeTag'({_id, tagId}) {
        Security.isAllowed(this.userId, roleGroups.MANAGER);

        Users.update(
            {_id},
            {$pull: {tagIds: tagId}}
        )
    }
});
