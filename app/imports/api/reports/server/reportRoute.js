import {
  getUserByToken
} from "/imports/api/uploads/server/router";
import Security from "/imports/api/accounts/security";
import RolesEnum from "/imports/api/users/enums/roles";
import fs from "fs";
import os from "os";
import FoldersEnum from "/imports/api/business";
import Settings from "/imports/api/settings/collection.js";

Picker.route("/report/:reportId", function (params, req, res, next) {
  //Checking user rights
  //   const user = getUserByToken(params.token);
  //   if (!user) {
  //     res.writeHead(404);
  //     res.write("Not logged in!");
  //   }
  //Add security here

  const {
    rootFolder
  } = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });

  const {
    reportId
  } = params;
  const reportPath =
    rootFolder + FoldersEnum.REPORTS_FOLDER + reportId + ".csv";
  if (!fs.existsSync(reportPath)) {

    res.writeHead(404);
    res.write('File Not Found');
    res.end();
  }
  let data = fs.readFileSync(reportPath);
  res.writeHead(200, {
    "Content-Type": "data:text/csv",
    "Content-Disposition": `attachment; filename=report.csv`
  });
  res.end(data);
});
Picker.route("/reportpdf/:reportId", function(params, req, res, next) {
  const { rootFolder } = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });

  const { reportId } = params;
  const reportPath =
    rootFolder + FoldersEnum.REPORTS_FOLDER + reportId + ".pdf";
  if (!fs.existsSync(reportPath)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }
  let data = fs.readFileSync(reportPath);
  res.writeHead(200, {
    "Content-Type": "data:application/pdf",
    "Content-Disposition": `attachment; filename=reportpdf.pdf`
  });
  res.end(data);
});