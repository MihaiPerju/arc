import fs from "fs";
import FoldersEnum from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

Picker.route("/report/:reportId", function(params, req, res) {
  const { root } = SettingsService.getSettings(settings.ROOT);

  const { reportId } = params;
  const reportPath = root + FoldersEnum.REPORTS_FOLDER + reportId + ".csv";
  if (!fs.existsSync(reportPath)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }
  let data = fs.readFileSync(reportPath);
  res.writeHead(200, {
    "Content-Type": "data:text/csv",
    "Content-Disposition": `attachment; filename=report.csv`
  });
  res.end(data);
});
Picker.route("/reportpdf/:reportId", function(params, req, res) {
  const { root } = SettingsService.getSettings(settings.ROOT);

  const { reportId } = params;
  const reportPath = root + FoldersEnum.REPORTS_FOLDER + reportId + ".pdf";
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
