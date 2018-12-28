import Settings from "../collection";
import Security from "/imports/api/security/security";
import SettingsService from "./SettingsService";

Meteor.methods({
  "settings.update"(data) {
    let userId = this.userId;
    let settingUpdate = null;
    Security.checkAdmin(userId);
    const { name } = data;

    //Standardize the folder names
    if (data.letterDirectory) {
      data.letterDirectory = data.letterDirectory.replace(/\s/g, "");
      if (data.letterDirectory[0] === "/") {
        data.letterDirectory = data.letterDirectory.substr(1);
      }
      if (data.letterDirectory[data.letterDirectory.length - 1] !== "/") {
        data.letterDirectory += "/";
      }
    }

    if (data.root) {
      data.root = data.root.replace(/\s/g, "");
      if (data.root[0] !== "/") {
        data.root = "/" + data.root;
      }
      if (data.root[data.root.length - 1] !== "/") {
        data.root += "/";
      }
    }

    data.userId = userId;
    settingUpdate = Settings.update({ name, userId }, { $set: data });
    if(!settingUpdate) {
      delete data.userId;
      Settings.update({ name }, { $set: data });
    }
    SettingsService.createDirectories();
  },

  "settings.get"(name) {
    let settings = null;
    let userId = this.userId;
    Security.checkLoggedIn(userId);
    settings = Settings.findOne({ name, userId });
    if(!settings){
      settings = Settings.findOne({ name });
    }
    return settings;
  },

  "managerSettings.get"(name) {
    let userId = this.userId;
    Security.checkLoggedIn(userId);
    return Settings.findOne({ name, userId });
  },

  "managerSettings.update"(data) {
    let userId = this.userId;
    Security.checkLoggedIn(userId);
    const { name } = data;
    data.userId = userId;
    if (data._id) Settings.update({ name, userId }, { $set: data });
    else Settings.insert(data);
  }
});
