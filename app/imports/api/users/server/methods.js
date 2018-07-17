import { Meteor } from "meteor/meteor";
import MyProfileSchema from "../schemas/MyProfileSchema";
import Users from "../collection";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import fs from "fs";
import os from "os";
import Business from "/imports/api/business";

Meteor.methods({
  "users.remove_avatar"() {
    const user = Users.findOne(this.userId);
    const { _id } = user.avatar;
    const avatar = Uploads.findOne({ _id });
    const { path } = avatar;

    Users.update(this.userId, {
      $unset: {
        avatar: ""
      }
    });
    fs.unlinkSync(Business.LOCAL_STORAGE_FOLDER + "/" + path);
    Uploads.remove(_id);
  },

  "users.get"(userIds) {
    return Users.find({ _id: { $in: userIds } }).fetch();
  },
  "user.tags.get"() {
    const userId = Meteor.userId();
    const { tagIds } = Users.findOne({ _id: userId });

    return tagIds;
  },

  "user.tag"({ _id, markerIds }) {
    Users.update(
      { _id },
      {
        $set: {
            markerIds
        }
      }
    );
  }
});
