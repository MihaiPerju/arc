import { createRoute } from "/imports/api/s3-uploads/server/router";
import os from "os";
import fs from "fs";
import JobQueue from "/imports/api/jobQueue/collection";
import jobTypes from "/imports/api/jobQueue/enums/jobQueueTypes";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Settings from "/imports/api/settings/collection";
import Business from "/imports/api/business";
import fileTypes from "/imports/api/files/enums/fileTypes";

createRoute(
  "/uploads/payment/:facilityId/:token",
  ({ user, facilityId, error, filenames, success }) => {
    if (filenames.length != 1) {
      return error("Invalid number of files");
    }
    const { rootFolder } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });
    let fileName = filenames[0].replace(os.tmpdir() + "/", "");

    fs.renameSync(
      filenames[0],
      rootFolder + Business.ACCOUNTS_FOLDER + fileName
    );

    const job = {
      type: jobTypes.IMPORT_DATA,
      status: jobStatuses.NEW,
      filePath: fileName,
      facilityId,
      fileType: fileTypes.PAYMENT,
      userId: user._id
    };

    JobQueue.insert(job);

    success();
  }
);

// import ParseService from "/imports/api/facilities/server/services/CsvParseService";
// import PaymentService from "/imports/api/facilities/server/services/PaymentService";
// import AccountActions from "/imports/api/accountActions/collection";
// createRoute(
//   "/uploads/payment/:facilityId/:token",
//   ({ facilityId, error, filenames, success }) => {
//     if (filenames.length != 1) {
//       return error("Invalid number of files");
//     }

//     const importRules = ParseService.getImportRules(facilityId, "paymentRules");
//     const stream = fs.readFileSync(filenames[0]);
//     const fileName = filenames[0].replace(os.tmpdir() + "/", "");
//     const csvString = stream.toString();
//     const { fileId, clientId } = Facilities.findOne({
//       _id: facilityId
//     });

//     const fileData = {
//       type: actionTypesEnum.FILE,
//       createdAt: new Date(),
//       fileId: newFileId,
//       fileName,
//       userId,
//       clientId,
//       filetype: fileTypes.PAYMENT
//     };

//     Papa.parse(csvString, {
//       chunk: results => {
//         // the result needs to be performed here
//         PaymentService.upload(results.data, importRules, facilityId);
//         let numberOfRecords = records.length;
//         const lastElement = records[numberOfRecords - 1];
//         if (lastElement.length < 2) {
//           records.pop();
//           numberOfRecords = records.length;
//         }
//         fileData.numberOfRecords = numberOfRecords;
//         AccountActions.insert(fileData);
//       }
//     });

//     success();
//   }
// );
