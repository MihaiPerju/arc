import Files from "/imports/api/files/collection";
import fs from "fs";
import csv from "csv-parse";
import Business from "/imports/api/business";
import Future from "fibers/future";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

export default class FileService {
  static update(_id, data) {
    Files.update(
      { _id },
      {
        $set: data
      }
    );
  }

  static getHeader(fileName) {
    const future = new Future();

    const { root } = SettingsService.getSettings(settings.ROOT);

    fs.createReadStream(root + Business.ACCOUNTS_FOLDER + fileName)
      .pipe(csv())
      .on("headers", headerList => {
        future.return(headerList[0]);
      })
      .on("error", error => {
        future.return(error);
      });

    return future.wait();
  }
}
