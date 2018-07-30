import Letters from "/imports/api/letters/collection";
import pdf from "html-pdf";
import fs from "fs";
import os from "os";
import Future from "fibers/future";
import PDFMerge from "pdfmerge";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import Statuses from "/imports/api/letters/enums/statuses";
import React from "react";
import ReactDOMServer from "react-dom/server";
import QRCode from "qrcode";
import Accounts from "/imports/api/accounts/collection";
import Clients from "/imports/api/clients/collection";
import Settings from "/imports/api/settings/collection";
import Business from "/imports/api/business";
import {
  Random
} from 'meteor/random';

const {
  rootFolder
} = Settings.findOne({
  rootFolder: {
    $ne: null
  }
});

export default class LetterManagement {
  static run() {
    const letters = Letters.find({
      status: Statuses.NEW,
      isManuallyMailed: false
    }).fetch();
    //convert every letter to pdf
    for (let letter of letters) {
      const {
        _id
      } = letter;
      const {
        filename
      } = this.createLetterContentPdf(letter.body, _id);
      this.attachPdfsToLetter(filename, _id, letter.attachmentIds);
    }
  }

  static createLetterContentPdf(html, letterId) {
    var future = new Future();

    const fileLocation = rootFolder + Business.ACCOUNTS_FOLDER + letterId + ".pdf";
    const {
      accountId
    } = Letters.findOne({
      _id: letterId
    });
    const {
      clientId
    } = Accounts.findOne({
      _id: accountId
    });
    const {
      clientName
    } = Clients.findOne({
      _id: clientId
    });

    QRCode.toDataURL(clientName)
      .then(url => {
          html = ReactDOMServer.renderToString( < img src = {
              url
            }
            />) + html;
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
        const {
          path
        } = Uploads.findOne({
          _id
        });
        const attachmentPath = rootFolder + Business.ACCOUNTS_FOLDER + path;
        files.push(attachmentPath);
      }

      let newFilename = rootFolder + Business.ACCOUNTS_FOLDER + Random.id() + ".pdf";
      while (fs.existsSync(newFilename)) {
        newFilename = rootFolder + Business.ACCOUNTS_FOLDER + Random.id() + ".pdf";
      }

      PDFMerge(files, newFilename)
        .then(function () {
          Letters.update({
            _id: letterId
          }, {
            $set: {
              status: Statuses.PENDING
            }
          });
          fs.renameSync(newFilename, filename);
        })
        .catch(function (error) {
          //returns error
        });

    }
  }