import { createRoute } from "/imports/api/s3-uploads/server/router";
import Papa from "papaparse";
import fs from "fs";
import LetterManagementService from "/imports/api/letters/server/service/LetterManagementService.js";

createRoute(
  "/uploads/letter-receive/:token",
  ({ user, error, filenames, success }) => {
    if (filenames.length != 1) {
      return error("Invalid number of files");
    }

    for (index in filenames) {
      const stream = fs.readFileSync(filenames[index]);
      const csvString = stream.toString();

      Papa.parse(csvString, {
        chunk: results => {
          // the result needs to be performed here
          LetterManagementService.getLetterCsvData(results.data,'receive');
        }
      });
    }
    success();
  }
);