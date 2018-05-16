import Letters from "/imports/api/letters/collection";
import pdf from "html-pdf";
import { Random } from "meteor/random";
import fs from "fs";
import os from "os";
import Future from "fibers/future";
import PDFMerge from "pdfmerge";
import Uploads from "/imports/api/s3-uploads/uploads/collection";

export default class LetterManagement {
  static run() {
    const letters = Letters.find().fetch();
    //convert every letter to pdf
    for (let letter of letters) {
      const { filename } = this.createLetterContentPdf(letter.body);
      this.attachPdfsToLetter(filename, letter.attachmentIds);
    }
  }

  static createUniqueLetterId() {
    return Random.id(7);
  }

  static createLetterContentPdf(html) {
    var future = new Future();

    const letterId = this.createUniqueLetterId();
    const fileLocation = os.tmpdir() + "/" + letterId + ".pdf";

    pdf.create(html).toFile(fileLocation, (err, res) => {
      if (err) {
        future.return(err);
      } else {
        future.return(res);
      }
    });
    return future.wait();
  }

  static attachPdfsToLetter(letterId, attachmentIds) {
    let files = [letterId];
    for (let _id of attachmentIds) {
      const { path } = Uploads.findOne({ _id });
      files.push(os.tmpdir() + "/uploads/" + path);
    }

    PDFMerge(files, os.tmpdir() + letterId)
      .then(function(done) {
        console.log(done); // success
      })
      .catch(function(error) {
        console.log(error);
        console.error(error.code); // Logs error code if an error occurs
      });
  }
}
