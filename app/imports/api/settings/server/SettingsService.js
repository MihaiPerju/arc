import Settings from "../collection";
import fs from "fs";
import settings from "/imports/api/settings/enums/settings";
import Business from "/imports/api/business";
 
export default class SettingsService {
  static getSettings(name) {
    return Settings.findOne({ name });
  }

  static createDirectories() {
    //create directory for root
    let { root } = this.getSettings(settings.ROOT);
    this.createDirectory(root);

    //Once the root folder was changed, create the other directories as well

    //Create folder for client logos
    const clientLogoFolder = root + Business.CLIENTS_FOLDER;
    this.createDirectory(clientLogoFolder);

    //Create folder for client logos
    const attachmentsFolder = root + Business.ACCOUNTS_FOLDER;
    this.createDirectory(attachmentsFolder);

    //Create folder for reports
    const reportsFolder = root + Business.REPORTS_FOLDER;
    this.createDirectory(reportsFolder);

    //Create letter directory
    let { letterDirectory } = this.getSettings(settings.LETTERS_DIRECTORY);
    letterDirectory = root + letterDirectory;
    this.createDirectory(letterDirectory);
  }

  static createDirectory(directory) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  }
}
