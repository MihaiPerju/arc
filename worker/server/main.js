import { Meteor } from "meteor/meteor";
import "/imports/cronjobs";
import os from "os";
import fs from "fs";
import FoldersEnum from "/imports/api/business";
import { Random } from "meteor/random";
import Settings from "/imports/api/settings/collection.js";

Meteor.startup(() => {
  workerId = Random.id();

  const { rootFolder } = Settings.findOne({
    rootFolder: { $ne: null }
  });
  // Checking folder for reports and letters
  const path = rootFolder;
  if (!fs.existsSync(path)) {
    // Do something
    fs.mkdirSync(path);
    fs.mkdirSync(path + FoldersEnum.REPORTS_FOLDER);
    fs.mkdirSync(path + FoldersEnum.ACCOUNTS_FOLDER);
  }
});

//Launching cronjob
SyncedCron.start();
