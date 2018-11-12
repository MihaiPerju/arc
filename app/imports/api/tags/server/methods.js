import Tags from "../collection.js";
import Users from "/imports/api/users/collection.js";
import RolesEnum from "/imports/api/users/enums/roles";
import TagService from "/imports/api/tags/server/services/TagService";

Meteor.methods({
  "tag.create"(data) {
    return TagService.createTag(data);
  },

  "tag.delete"(_id) {
    if (Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
      return Tags.remove({ _id });
    }else{
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
    if (Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
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
    if (Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
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
