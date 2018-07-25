import Settings from "/imports/api/settings/collection.js";
import Business from "/imports/api/business";
import fs from "fs";

Meteor.startup(function() {
  let { rootFolder } = Settings.findOne({
    rootFolder: { $ne: null }
  });

  if (!rootFolder) {
    Settings.insert({ rootFolder: "/tmp/arcc/" });
    rootFolder = "/tmp/arcc/";
  }

  //Create default root folder
  if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder);
  }

  //Create folder for client logos
  const clientLogoFolder = rootFolder + Business.CLIENTS_FOLDER + "/";
  if (!fs.existsSync(clientLogoFolder)) {
    fs.mkdirSync(clientLogoFolder);
  }
});
