import { Meteor } from "meteor/meteor";
import Users from "../collection";
import Uploads from "/imports/api/uploads/uploads/collection";
import fs from "fs";
import Business from "/imports/api/business";
import RolesEnum from '/imports/api/users/enums/roles';

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
    const filePath = Business.LOCAL_STORAGE_FOLDER + "/" + path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
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
  "users.getReps"() {
    return Users.find({ roles: RolesEnum.REP }).fetch();
  }
});
