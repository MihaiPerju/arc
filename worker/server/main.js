import { Meteor } from "meteor/meteor";
import "/imports/cronjobs";
import os from "os";
import fs from "fs";
import FoldersEnum from "/imports/api/business";
import { Random } from "meteor/random";

Meteor.startup(() => {
  workerId = Random.id();
  // Checking folder for reports and letters
  const path = os.tmpDir() + FoldersEnum.APP_FOLDER;
  if (!fs.existsSync(path)) {
    // Do something
    fs.mkdirSync(path);
    fs.mkdirSync(path + FoldersEnum.REPORTS_FOLDER);
    fs.mkdirSync(path + FoldersEnum.ACCOUNTS_FOLDER);
  }
});

//Launching cronjob
SyncedCron.start();