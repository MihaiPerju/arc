import { Meteor } from "meteor/meteor";
import Users from "../collection";
import Uploads from "/imports/api/uploads/uploads/collection";
import fs from "fs";
import Business from "/imports/api/business";
import RolesEnum from "/imports/api/users/enums/roles";
import Accounts from "/imports/api/accounts/collection";
import Facilities from "/imports/api/facilities/collection";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import UserService from "./services/UserService";

Meteor.methods({
  "users.remove_avatar"() {
    const user = Users.findOne(this.userId);
    const { _id } = user.avatar;
    const avatar = Uploads.findOne({
      _id
    });
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

  "users.getWithTags"(filters = {}) {
    return UserService.getUsers(filters);
  },

  "user.getWithTags"(filters = {}) {
    return UserService.getUser(filters);
  },

  "users.get"(filters = {}) {
    return Users.find(filters).fetch();
  },

  "users.list"(params) {
    const queryParams = QueryBuilder.getUserParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    //Project fields
    options.fields = { emails: 1 };
    return Users.find(filters, options).fetch();
  },

  "user.getOne"(_id) {
    return Users.findOne({ _id });
  },

  "users.count"(params) {
    const queryParams = QueryBuilder.getUserParams(params);
    let filters = queryParams.filters;
    return Users.find(filters).count();
  },

  "user.tags.get"() {
    const userId = Meteor.userId();
    const { tagIds } = Users.findOne({
      _id: userId
    });

    return tagIds;
  },

  "users.getReps"() {
    return Users.find({
      roles: RolesEnum.REP
    }).fetch();
  },

  "users.getManagers"() {
    return Users.find({
      roles: RolesEnum.MANAGER
    }).fetch();
  },

  "users.getRepsByFacilities"(facilityIds) {
    let facilityProjection = { fields: { allowedUsers: 1 } };
    let facilities = Facilities.find(
      { _id: { $in: facilityIds } },
      facilityProjection
    ).fetch();
    let userIds = [];
    for (let facility of facilities) {
      if (facility.allowedUsers) {
        userIds = userIds.concat(facility.allowedUsers);
      }
    }
    let userProjection = { fields: { profile: 1, roles: 1 } };
    let users = Users.find({ _id: { $in: userIds } }, userProjection).fetch();
    let userOptions = users.map(user => {
      return {
        label:
          user &&
          user.profile &&
          user.profile.firstName +
            " " +
            user.profile.lastName +
            "(" +
            user.roles[0] +
            ")",
        value: user && user._id
      };
    });
    return userOptions;
  },
  "users.getRepsByFacility"(_id) {
    const account = Accounts.findOne({
      _id
    });

    if (account) {
      const { facilityId } = account;
      const facility = Facilities.findOne({
        _id: facilityId
      });

      if (facility) {
        const { allowedUsers } = facility;

        const users = Users.find({
          _id: {
            $in: allowedUsers
          },
          roles: RolesEnum.REP
        }).fetch();

        return users;
      }
    }
    return [];
  },

  "user.statistics.get"() {
    const userId = Meteor.userId();
    var user = Users.findOne({
      _id: userId
    });
    return user;
  },


});
