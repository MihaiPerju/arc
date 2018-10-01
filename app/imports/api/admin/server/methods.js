import { Accounts } from "meteor/accounts-base";
import Users from "/imports/api/users/collection.js";
import Security from "/imports/api/security/security.js";
import Settings from "/imports/api/settings/collection.js";
import AccountActions from "/imports/api/accountActions/collection";
import Substates from "/imports/api/substates/collection";
import Backup from "/imports/api/backup/collection";
import Files from "/imports/api/files/collection";
import Letters from "/imports/api/letters/collection.js";
import Rules from "/imports/api/rules/collection.js";
import AccountsCollection from "/imports/api/accounts/collection";
import Escalations from "/imports/api/escalations/collection";
import { createFolderStructure } from "/imports/startup/server/folders";
import UserRoles from '/imports/api/users/enums/roles';
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
    Security.checkAdmin(this.userId);

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

  "admin.suspendUser"(userId) {
    Security.checkAdmin(this.userId);

    if (!userId) {
      throw new Meteor.Error("No user");
    }

    const settings = Settings.findOne();

    Settings.update(
      {
        _id: settings._id
      },
      {
        $addToSet: {
          suspendedUserIds: userId
        }
      }
    );

    Users.update(
      {
        _id: userId
      },
      {
        $set: {
          "profile.suspended": true
        }
      }
    );
  },

  "admin.resumeUser"(userId) {
    Security.checkAdmin(this.userId);
    if (!userId) {
      throw new Meteor.Error("No user");
    }

    const settings = Settings.findOne();

    Settings.update(
      {
        _id: settings._id
      },
      {
        $pull: {
          suspendedUserIds: userId
        }
      }
    );

    Users.update(
      {
        _id: userId
      },
      {
        $set: {
          "profile.suspended": false
        }
      }
    );
  },

  "admin.updateRootFolder"({ rootFolder, letterFolderPath }) {
    /** Root Folder Directory */
    rootFolder = rootFolder.trim();
    if (rootFolder[0] !== "/") {
      rootFolder = "/" + rootFolder;
    }
    if (rootFolder[rootFolder.length - 1] !== "/") {
      rootFolder += "/";
    }

    /** PDF Folder Directory */
    letterFolderPath = letterFolderPath.trim();
    if (letterFolderPath[0] !== "/") {
      letterFolderPath = "/" + letterFolderPath;
    }

    Settings.update(
      { 
        // rootFolder: {
        //    $ne: null
        // }    
      },
      {
        $set: {
          rootFolder,
          letterFolderPath
        }
      },
      {
        upsert: true
      }
    );

    createFolderStructure();
  },

  "admin.getRootFolder"() {
    return Settings.findOne({
      $or:[
        { 
            rootFolder: {
            $exists: true
          } 
        },
        {
          letterFolderPath: {
            $exists: true
          }
        }
      ]
    });
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


  "admin.mailSettingUpdate"({mailSetting}) {
    Security.checkAdmin(this.userId);
    
   if(mailSetting.ssl === 'true'){
     mailSetting = {
       ...mailSetting,
       ssl: true
     }
   }else{
     mailSetting = {
      ...mailSetting,
      ssl: false
    }
   }
   if(mailSetting.authentication == "Anonymous Account") {
     delete mailSetting.username;
     delete mailSetting.password;
   }

    Settings.update(
      {},
      {
        $set: {
          mailSetting
        }
      },
      {
        upsert: true
      }
    );
  },

  "admin.getMailSetting"() {
    return Settings.findOne({
      mailSetting: {
        $exists: true
      }
    });
  },

  "admin.getLetterSettings"() {
    return Settings.findOne({
      letterCompileTime: {
        $exists: true
      }
    });
  },

  "admin.updateLetterSettings"({ letterCompileTime }) {
    Security.checkAdmin(this.userId);
    Settings.update(
      {},
      {
        $set: {
          letterCompileTime
        }
      },
      {
        upsert: true
      }
    );
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
