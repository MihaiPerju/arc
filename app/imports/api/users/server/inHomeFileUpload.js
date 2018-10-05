import { createRoute } from "/imports/api/uploads/server/router";
import Papa from "papaparse";
import fs from "fs";
import LetterManagementService from "/imports/api/letters/server/service/LetterManagementService.js";
import Statuses from "/imports/api/letters/enums/statuses.js";

createRoute(
  "/uploads/letter-receive/:token",
  ({  error, filenames, success }) => {
    if (filenames.length != 1) {
      return error("Invalid number of files");
    }

    for (let index in filenames) {
      const stream = fs.readFileSync(filenames[index]);
      const csvString = stream.toString();

      Papa.parse(csvString, {
        chunk: results => {
          // the result needs to be performed here
          LetterManagementService.getLetterCsvData(
            results.data,
            Statuses.RECEIVED
          );
        }
      });
    }
    success();
  }
);
