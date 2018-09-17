import Settings from "/imports/api/settings/collection.js";
import Business from "/imports/api/business";
import fs from "fs";
import os from "os"

Meteor.startup(function () {
  createFolderStructure();
});

const createFolderStructure = function () {
  let rootSettings = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });
  if (!rootSettings) {
    const _id = Settings.insert({
      rootFolder: os.tmpdir() + "/"
    })
    rootSettings = Settings.findOne({
      _id
    });
  }
  let {
    rootFolder
  } = rootSettings;

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
}

export {
  createFolderStructure
};