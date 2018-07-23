import { createRoute } from "/imports/api/s3-uploads/server/router";
import Papa from "papaparse";
import fs from "fs";
import AccountService from "/imports/api/facilities/server/services/AccountImportingService";
import ParseService from "/imports/api/facilities/server/services/CsvParseService";
import Files from "/imports/api/files/collection";
import os from "os";
import Facilities from "/imports/api/facilities/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import AccountActions from "/imports/api/accountActions/collection";

createRoute(
  "/uploads/csv/:facilityId/:token",
  ({ user, facilityId, error, filenames, success }) => {
    if (filenames.length != 1) {
      return error("Invalid number of files");
    }
    const importRules = ParseService.getImportRules(
      facilityId,
      "placementRules"
    );

    //Parsing and getting the CSV like a string
    let fileName = filenames[0].replace(os.tmpdir() + "/", "");
    const stream = fs.readFileSync(filenames[0]);
    const csvString = stream.toString();

    //Keep reference to previous file
    const { fileId, clientId } = Facilities.findOne({ _id: facilityId });
    const newFileId = Files.insert({
      fileName,
      facilityId,
      previousFileId: fileId
    });

    const fileData = {
      type: actionTypesEnum.FILE,
      createdAt: new Date(),
      fileId: newFileId,
      fileName,
      userId: user._id,
      clientId
    };

    const accountActionId = AccountActions.insert(fileData);

    //Add reference to facility
    Facilities.update(
      { _id: facilityId },
      {
        $set: {
          fileId: newFileId
        },
        $push: {
          fileIds: accountActionId
        }
      }
    );

    //Pass links to accounts to link them too
    const links = { facilityId, fileId: newFileId };

    Papa.parse(csvString, {
      chunk: results => {
        AccountService.upload(results.data, importRules, links);
      }
    });

    success();
  }
);
