import { Accounts } from "meteor/accounts-base";
import Users from "/imports/api/users/collection.js";
import Security from "/imports/api/security/security.js";
import AccountActions from "/imports/api/accountActions/collection";
import Substates from "/imports/api/substates/collection";
import Backup from "/imports/api/backup/collection";
import Files from "/imports/api/files/collection";
import Letters from "/imports/api/letters/collection.js";
import Rules from "/imports/api/rules/collection.js";
import AccountsCollection from "/imports/api/accounts/collection";
import Escalations from "/imports/api/escalations/collection";

Meteor.methods({
  "admin.createUser"({ firstName, lastName, email, phoneNumber, password }) {
    Security.checkAdmin(this.userId);

    return Accounts.createUser({
      email,
      password,
      profile: {
        firstName,
        lastName,
        phoneNumber
      }
    });
  },
  "admin.checkAdmin"(userId) {
    return Security.checkIfAdmin(userId);
  },

  "admin.editUser"(userId, { email, profile, tagIds }) {
    Security.isAdminOrManager(this.userId);

    if (!userId) {
      throw new Meteor.Error("No user");
    }

    const existingUser = Users.findOne({
      "emails.address": email,
      _id: {
        $ne: userId
      }
    });

    if (existingUser) {
      throw new Meteor.Error("Email already in use!");
    }

    Users.update(
      {
        _id: userId
      },
      {
        $set: {
          emails: [
            {
              address: email,
              verified: false
            }
          ],
          profile,
          tagIds
        }
      }
    );
  },

  "admin.deleteUser"(userId) {
    Security.checkAdmin(this.userId);

    Users.remove({
      _id: userId
    });
  },

  "admin.deleteManyUsers"(userIds) {
    Security.checkAdmin(this.userId);
    Users.remove({
      _id: {
        $in: userIds
      }
    });
  },

  //Testing purpose only, delete in production
  reset(entity) {
    switch (entity) {
      case "accounts":
        AccountsCollection.remove({});
        Backup.remove({});
        Escalations.remove({});
        break;
      case "accountActions":
        AccountActions.remove({});
        break;
      case "substates":
        Substates.remove({});
        break;
      case "letters":
        Letters.remove({});
        break;
      case "rules":
        Rules.remove({});
        break;
      default:
        AccountsCollection.remove({});
        Backup.remove({});
        Escalations.remove({});
        AccountActions.remove({});
        Files.remove({});
    }
  }
});
