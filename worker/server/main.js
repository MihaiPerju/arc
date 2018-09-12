import { Meteor } from "meteor/meteor";
import "/imports/cronjobs";
import os from "os";
import fs from "fs";
import FoldersEnum from "/imports/api/business";
import { Random } from "meteor/random";
import Settings from "/imports/api/settings/collection.js";
import Business from "/imports/api/business";

Meteor.startup(() => {
  workerId = Random.id();

  let rootSettings = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });
  if (!rootSettings) {
    const _id = Settings.insert({
      rootFolder: os.tmpdir() + "/"
    });
    rootSettings = Settings.findOne({
      _id
    });
  }
  let { rootFolder } = rootSettings;

  //Create default root folder
  if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder);
  }

  //Create folder for client logos
  const clientLogoFolder = rootFolder + Business.CLIENTS_FOLDER;
  if (!fs.existsSync(clientLogoFolder)) {
    fs.mkdirSync(clientLogoFolder);
  }

  //Create folder for client logos
  const attachmentsFolder = rootFolder + Business.ACCOUNTS_FOLDER;
  if (!fs.existsSync(attachmentsFolder)) {
    fs.mkdirSync(attachmentsFolder);
  }

  //Create folder for reports
  const reportsFolder = rootFolder + Business.REPORTS_FOLDER;
  if (!fs.existsSync(reportsFolder)) {
    fs.mkdirSync(reportsFolder);
  }
  //Launching cronjob
  SyncedCron.start();
});
