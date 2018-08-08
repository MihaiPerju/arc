import React from "react";
import Letters from "../collection.js";
import pdf from "html-pdf";
import Future from "fibers/future";
import QRCode from "qrcode";
import ReactDOMServer from "react-dom/server";
import Accounts from "/imports/api/accounts/collection";
import Clients from "/imports/api/clients/collection";
import Settings from "/imports/api/settings/collection";
import Business from "/imports/api/business";

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
    const { rootFolder } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });
    const letterLocation =
      rootFolder + Business.ACCOUNTS_FOLDER + letterId + ".pdf";
    let future = new Future();

    QRCode.toDataURL(clientName)
      .then(url => {
        letter.body =
          ReactDOMServer.renderToString(<img src={url} />) + letter.body;
        pdf
          .create(letter.body)
          .toFile(letterLocation, function(error, success) {
            future.return(error ? { error } : { success });
          });
      })
      .catch(err => {
        console.error(err);
      });
    const { success } = future.wait();
    return success ? letterLocation : success;
  }
}

export default new LetterService();
