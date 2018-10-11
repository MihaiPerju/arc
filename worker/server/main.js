import { Meteor } from "meteor/meteor";
import "/imports/cronjobs";
import os from "os";
import fs from "fs";
import { Random } from "meteor/random";
import Settings from "/imports/api/settings/collection.js";
import "/imports/server/watchers/index";
import Business from "/imports/api/business";

Meteor.startup(() => {
  workerId = Random.id();

    //Launching cronjob
    SyncedCron.start();
});
