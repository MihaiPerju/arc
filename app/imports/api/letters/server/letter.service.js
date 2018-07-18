import React from "react";
import Letters from "../collection.js";
import pdf from "html-pdf";
import os from "os";
import Future from "fibers/future";
import QRCode from "qrcode";
import ReactDOMServer from "react-dom/server";
import Accounts from "/imports/api/accounts/collection";
import Clients from "/imports/api/clients/collection";

class LetterService {
  getLetterTemporalPdfLoc(accountId, letterId) {
    const letter = Letters.findOne(
      {
        _id: letterId,
        accountId
      },
      {
        fields: { body: 1 }
      }
    );
    const { clientId } = Accounts.findOne({ _id: accountId });
    const { clientName } = Clients.findOne({ _id: clientId });
    const fileLocation = `${os.tmpdir()}/${letter._id}.pdf`;
    let future = new Future();

    QRCode.toDataURL(clientName)
      .then(url => {
        letter.body =
          ReactDOMServer.renderToString(<img src={url} />) + letter.body;
        pdf.create(letter.body).toFile(fileLocation, function(error, success) {
          future.return(error ? { error } : { success });
        });
      })
      .catch(err => {
        console.error(err);
      });
    const { success } = future.wait();
    return success ? fileLocation : success;
  }
}

export default new LetterService();
