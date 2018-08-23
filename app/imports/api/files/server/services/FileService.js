import Files from "/imports/api/files/collection";
import fs from "fs";
import csv from "csv-parse";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection";
import Future from "fibers/future";

export default class FileService {
  static updateFileStatus(_id, status) {
    Files.update(
      { _id },
      {
        $set: { status }
      }
    );
  }

  static getHeader(fileName) {
    const future = new Future();

    const { rootFolder } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });

    fs.createReadStream(rootFolder + Business.ACCOUNTS_FOLDER + fileName)
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
