import { Meteor } from "meteor/meteor";
import Letters from "../collection.js";
import Statuses from "/imports/api/letters/enums/statuses.js";

Meteor.methods({
  "letter.create"(data) {
    Letters.insert(data);
  },

  "letter.get"(letterId) {
    return Letters.findOne(letterId);
  },

  "letter.delete"(letterId) {
    const { status } = Letters.findOne({ _id: letterId });
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }
    Letters.remove(letterId);
  },

  "letter.update"(_id, { body, letterTemplateId, attachmentIds, letterValues }) {
    const { status } = Letters.findOne({ _id });
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }

    Letters.update(
      { _id },
      {
        $set: {
          body,
          letterTemplateId,
          attachmentIds,
          letterValues
        }
      }
    );
  }
});
