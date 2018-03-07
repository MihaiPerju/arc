import Tags from '../collection.js';
import Security from '/imports/api/security/security.js';
import Users from '/imports/api/users/collection.js';

Meteor.methods({
    'tag.create'(data) {
        Security.isAdminOrTech(this.userId);

        data.userId = this.userId;
        return Tags.insert(data);
    },

    'tag.delete'(_id) {
        Security.isAdminOrTech(this.userId);

        Tags.remove({ _id: _id });
    },

    'tag.getAll'() {
        const user = Users.findOne({ _id: this.userId }, { roles: 1 });

        let tags = Tags.find({
            $or: [
                {
                    userId: this.userId
                },
                {
                    privacy: 'Public'
                },
                {
                    visibility: {
                        $in: user.roles
                    }
                }
            ]
        }).fetch();

        return tags;
    },

    'user.getTags'(tagIds) {
        tagIds = tagIds || [];
        Security.isAdminOrTech(this.userId);

        if (tagIds.length === 0) {
            return [];
        }

        return Tags.find({
            _id: {
                $in: tagIds
            }
        }).fetch();
    }
});
