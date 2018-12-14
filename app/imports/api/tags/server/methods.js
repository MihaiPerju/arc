import Tags from "../collection.js";
import Users from "/imports/api/users/collection.js";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import TagService from "/imports/api/tags/server/services/TagService";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import Accounts from '/imports/api/accounts/collection';

Meteor.methods({
  "tags.list"(params) {
    const queryParams = QueryBuilder.getTagsParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    options.fields = { name: 1 };
    return Tags.find(filters, options).fetch();
  },

  "tags.count"(params) {
    const queryParams = QueryBuilder.getTagsParams(params);
    let filters = queryParams.filters;
    return Tags.find(filters).count();
  },

  "tag.getOne"(_id) {
    return Tags.findOne({ _id });
  },

  "tags.get"(filters = {}) {
    return Tags.find(filters).fetch();
  },

  "tag.create"(data) {
    return TagService.createTag(data);
  },

  "tag.delete"(_id) {
    if (Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
      Tags.remove({ _id });

      //Unassigning accounts from tags
      let workQueueId = _id;
      Accounts.update({ workQueueId }, { $unset: { workQueueId: null } });
    } else {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },

  "tag.edit"(id, data) {
    return Tags.update(
      { _id: id },
      {
        $set: data
      }
    );
  },

  "tags.deleteMany"(ids) {
    Tags.remove({ _id: { $in: ids } });
  },

  "user.addTag"({ userIds, tagId }) {
    if (Roles.userIsInRole(this.userId, roleGroups.ADMIN_TECH_MANAGER)) {
      _.each(userIds, _id => {
        return TagService.addTagToUser({ _id, tagId });
      });
    } else {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },

  "user.removeTags"({ userIds, tagId }) {
    if (Roles.userIsInRole(this.userId, roleGroups.ADMIN_TECH_MANAGER)) {
      Users.update({ _id: { $in: userIds } }, { $pull: { tagIds: tagId } });
    } else {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },

  "tags.tag"({ _id, tagIds }) {
    Tags.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
