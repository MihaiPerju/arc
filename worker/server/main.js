import { Meteor } from "meteor/meteor";
import "/imports/cronjobs";
import os from "os";
import fs from "fs";
import FoldersEnum from "/imports/api/business";
import { Random } from "meteor/random";

Meteor.startup(() => {
  workerId = Random.id();
  // code to run on server at startup
  const path = os.tmpDir() + FoldersEnum.APP_FOLDER;
  if (!fs.existsSync(path)) {
    // Do something
    fs.mkdirSync(path);
    fs.mkdirSync(path + FoldersEnum.REPORTS_FOLDER);
  }
});

//Launching cronjob
SyncedCron.start();