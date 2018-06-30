import Letters from "/imports/api/letters/collection";
import pdf from "html-pdf";
import { Random } from "meteor/random";
import fs from "fs";
import os from "os";
import Future from "fibers/future";
import PDFMerge from "pdfmerge";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import Statuses from "/imports/api/letters/enums/statuses";
import FoldersEnum from "/imports/api/business";
import FolderService from "./FolderService";
import React from "react";
import ReactDOMServer from "react-dom/server";
import QRCode from "qrcode";
import Accounts from "/imports/api/accounts/collection";
import Clients from "/imports/api/clients/collection";

export default class LetterManagement {
  static run() {
    const letters = Letters.find({ status: Statuses.NEW }).fetch();
    //convert every letter to pdf
    for (let letter of letters) {
      const { _id } = letter;
      const { filename } = this.createLetterContentPdf(letter.body, _id);
      this.attachPdfsToLetter(filename, _id, letter.attachmentIds);
    }
  }

  static createLetterContentPdf(html, letterId) {
    var future = new Future();

    const fileLocation = os.tmpdir() + "/" + letterId + ".pdf";
    const { accountId } = Letters.findOne({ _id: letterId });
    const { clientId } = Accounts.findOne({ _id: accountId });
    const { clientName } = Clients.findOne({ _id: clientId });
    
    QRCode.toDataURL(clientName)
      .then(url => {
        html = ReactDOMServer.renderToString(<img src={url} />) + html;
        pdf.create(html).toFile(fileLocation, (err, res) => {
          if (err) {
            future.return(err);
          } else {
            future.return(res);
          }
        });
      })
      .catch(err => {
        console.error(err);
      });

    return future.wait();
  }

  static attachPdfsToLetter(filename, letterId, attachmentIds) {
    let files = [filename];
    for (let _id of attachmentIds) {
      const { path } = Uploads.findOne({ _id });
      const attachmentPath = os.tmpdir() + "/uploads/" + path;
      files.push(attachmentPath);
    }
    const accountsDirectoryPath =
      os.tmpdir() + FoldersEnum.APP_FOLDER + FoldersEnum.ACCOUNTS_FOLDER;

    FolderService.checkFolder(accountsDirectoryPath);
    const letterSavePath = accountsDirectoryPath + "/" + letterId + ".pdf";

    PDFMerge(files, letterSavePath)
      .then(function(done) {
        Letters.update(
          { _id: letterId },
          {
            $set: {
              status: Statuses.PENDING
            }
          }
        );
        fs.unlinkSync(filename);
      })
      .catch(function(error) {
        //returns error
      });
  }
}
