import {Meteor} from 'meteor/meteor';
import MyProfileSchema from '../schemas/MyProfileSchema';
import Users from '../collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';

Meteor.methods({
    'users.my_profile.update'(data) {
        MyProfileSchema.validate(data);

        const {email, profile} = data;
        const user = Users.findOne(this.userId);

        Users.update(this.userId, {
            $set: {
                'emails.0.address': email,
                profile: _.extend(user.profile, profile)
            }
        })
    },

    'users.remove_avatar'() {
        const user = Users.findOne(this.userId);
        const avatarId = user.avatar._id;

        Uploads.remove(avatarId);

        Users.update(this.userId, {
            $unset: {
                avatar: ''
            }
        })
    },

    'users.getByRole'(roles) {
        return Users.find({
            roles: {
                $in: roles
            }
        }).fetch();
    }
});