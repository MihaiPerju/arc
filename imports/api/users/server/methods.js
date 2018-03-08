import { Meteor } from 'meteor/meteor';
import MyProfileSchema from '../schemas/MyProfileSchema';
import Users from '../collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import fs from 'fs';
import os from 'os';
import Business from '/imports/api/business';

Meteor.methods({
    'users.my_profile.update'(data) {
        MyProfileSchema.validate(data);

        const { email, profile } = data;
        const user = Users.findOne(this.userId);

        Users.update(this.userId, {
            $set: {
                'emails.0.address': email,
                profile: _.extend(user.profile, profile)
            }
        });
    },

    'users.remove_avatar'() {
        const user = Users.findOne(this.userId);
        const { _id } = user.avatar;
        const avatar = Uploads.findOne({ _id });
        const { path } = avatar;

        Users.update(this.userId, {
            $unset: {
                avatar: ''
            }
        });
        fs.unlinkSync(Business.LOCAL_STORAGE_FOLDER + '/' + path);
        Uploads.remove(_id);
    },

    'users.get'(userIds) {
        return Users.find({ _id: { $in: userIds } }).fetch();
    }
});
