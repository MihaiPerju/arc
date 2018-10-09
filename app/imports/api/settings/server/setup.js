import Settings from "../collection.js";
import settings from "/imports/api/settings/enums/settings";
import os from "os";
import SettingsService from "./SettingsService.js";

Meteor.startup(function() {
  //Check root settings
  let root = Settings.findOne({ name: settings.ROOT });
  if (!root) {
    root = os.tmpdir() + "/";
    Settings.insert({ name: settings.ROOT, root });
  }

  //Check letter directory settings
  let letterDirectory = Settings.findOne({
    name: settings.LETTERS_DIRECTORY
  });
  if (!letterDirectory) {
    letterDirectory = "letters/";
    Settings.insert({ name: settings.LETTERS_DIRECTORY, letterDirectory });
  }

  //Check letter compile time settings
  let letterCompileTime = Settings.findOne({
    name: settings.COMPILE_TIME
  });
  if (!letterCompileTime) {
    letterCompileTime = new Date();
    Settings.insert({ name: settings.COMPILE_TIME, letterCompileTime });
  }

  //Check SMTP Settings
  let smtp = Settings.findOne({
    name: settings.SMTP
  });
  if (!smtp) {
    Settings.insert({ name: settings.SMTP });
  }

  SettingsService.createDirectories();
});
