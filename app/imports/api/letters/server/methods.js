import { Meteor } from "meteor/meteor";
import Letters from "../collection.js";
import Security from "/imports/api/security/security";
import { roleGroups } from "/imports/api/users/enums/roles";
import LetterService from "/imports/api/letters/server/service/LetterService";

Meteor.methods({
  "letter.create"(data) {
    data.userId = this.userId;
    LetterService.createLetter(data);
  },

  "letter.get"(letterId) {
    return Letters.findOne(letterId);
  },

  "letter.delete"(letterId) {
    LetterService.deleteLetter(letterId);
  },

  "letter.update"(_id, data) {
    LetterService.updateLetter(_id, data);
  },

  "letter.mailManually"(_id) {
    Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
    Letters.update(
      { _id },
      {
        $set: {
          isManuallyMailed: true
        }
      }
    );
  },

  "letter.updateStatus"(_id, status) {
    Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
    Letters.update(
      { _id },
      {
        $set: {
          status
        }
      }
    );
  },

  "letter.tag"({ _id, tagIds }) {
    Letters.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
