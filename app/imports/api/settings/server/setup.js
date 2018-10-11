import Settings from "../collection.js";
import os from "os";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

Meteor.startup(function() {
  //Check root settings
  let root = SettingsService.getSettings(settings.ROOT);
  if (!root) {
    root = os.tmpdir() + "/";
    Settings.insert({ name: settings.ROOT, root });
  }

  //Check letter directory settings
  let letterDirectory = SettingsService.getSettings(settings.LETTERS_DIRECTORY);
  if (!letterDirectory) {
    letterDirectory = "letters/";
    Settings.insert({ name: settings.LETTERS_DIRECTORY, letterDirectory });
  }

  //Check letter compile time settings
  let letterCompileTime = SettingsService.getSettings(settings.COMPILE_TIME);
  if (!letterCompileTime) {
    letterCompileTime = new Date();
    Settings.insert({ name: settings.COMPILE_TIME, letterCompileTime });
  }

  //Check SMTP Settings
  let smtp = SettingsService.getSettings(settings.SMTP);
  if (!smtp) {
    Settings.insert({ name: settings.SMTP });
  }

  SettingsService.createDirectories();
});
