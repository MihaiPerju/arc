import Accounts from "/imports/api/accounts/collection";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import { getUserByToken } from "/imports/api/s3-uploads/server/router";
import PDFMerge from "pdf-merge";
import Settings from "/imports/api/settings/collection.js";

Picker.route("/pdfs/:_id/:token", function(params, req, res, next) {
  //Checking user rights
  const user = getUserByToken(params.token);
  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
  }

  //Getting attached PDFs from account
  const account = Accounts.findOne({ _id: params._id });
  const { attachmentIds } = account;

  const { rootFolder } = Settings.findOne({
    rootFolder: { $ne: null }
  });

  const files = [];
  for (let _id of attachmentIds) {
    const { path } = Uploads.findOne({ _id });
    files.push(rootFolder + path);
  }

  //Merge PDFs
  PDFMerge(files).then(buffer => {
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${params._id}.merged.pdf`,
      "Content-Length": buffer.length
    });
    res.end(buffer);
  });
});
