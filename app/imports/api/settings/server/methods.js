import Settings from "../collection";
import Security from "/imports/api/security/security";
import SettingsService from "./SettingsService";

Meteor.methods({
  "settings.update"(data) {
    Security.checkAdmin(this.userId);
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

    Settings.update({ name }, { $set: data });
    SettingsService.createDirectories();
  },
  "settings.get"(name) {
    Security.checkAdmin(this.userId);
    return Settings.findOne({ name });
  }
});
