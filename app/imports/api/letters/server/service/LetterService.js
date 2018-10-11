import React from "react";
import pdf from "html-pdf";
import Future from "fibers/future";
import QRCode from "qrcode";
import ReactDOMServer from "react-dom/server";
import Accounts from "/imports/api/accounts/collection";
import Clients from "/imports/api/clients/collection";
import { Random } from "meteor/random";
import { existsSync, renameSync, unlinkSync } from "fs";
import PDFMerge from "pdfmerge";
import Uploads from "/imports/api/uploads/uploads/collection";
import Letters from "/imports/api/letters/collection";
import AccountActions from "/imports/api/accountActions/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import Statuses from "/imports/api/letters/enums/statuses.js";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";
import Business from "/imports/api/business";

export default class LetterService {
  static createLetter(data) {
    const { userId, accountId, letterTemplateId, letterTemplateName } = data;
    const { clientId } = Accounts.findOne({ _id: accountId });
    const letterData = {
      userId,
      type: actionTypesEnum.LETTER,
      createdAt: new Date(),
      accountId,
      letterTemplateId,
      clientId,
      letterTemplateName
    };
    const letterId = Letters.insert(data);

    // create the pdf for the created letter
    this.createPdf(letterId);

    // create the account action type 'letter'
    AccountActions.insert(letterData);
  }

  static updateLetter(
    _id,
    { body, letterTemplateId, attachmentIds, letterValues }
  ) {
    const { status } = Letters.findOne({ _id });
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }

    Letters.update(
      { _id },
      {
        $set: {
          body,
          letterTemplateId,
          attachmentIds,
          letterValues
        }
      }
    );
    this.createPdf(_id);
  }

  static deleteLetter(_id) {
    let { root } = SettingsService.getSettings(settings.ROOT);
    let { letterDirectory } = SettingsService.getSettings(
      settings.LETTERS_DIRECTORY
    );

    const { status } = Letters.findOne({ _id });
    const filePath = (root + letterDirectory).replace("//", "/") + _id + ".pdf";
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }
    Letters.remove(_id);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  static createPdf(letterId) {
    let { root } = SettingsService.getSettings(settings.ROOT);
    let { letterDirectory } = SettingsService.getSettings(
      settings.LETTERS_DIRECTORY
    );

    let { attachmentIds, body, accountId } = Letters.findOne({ _id: letterId });
    const { clientId } = Accounts.findOne({ _id: accountId });
    const { clientName } = Clients.findOne({ _id: clientId });
    const filePath =
      (root + letterDirectory).replace("//", "/") + letterId + ".pdf";
    const future = new Future();

    QRCode.toDataURL(clientName)
      .then(url => {
        body = ReactDOMServer.renderToString(<img src={url} />) + body;
        pdf.create(body).toFile(filePath, (err, res) => {
          if (err) {
            future.return(err);
          } else {
            future.return(res);
          }
        });
      })
      .catch(err => {
        throw err;
      });

    const { filename } = future.wait();
    if (filename) {
      this.attachPdfs(filename, attachmentIds, accountId);
    }
  }

  static attachPdfs(filename, attachmentIds, accountId) {
    let { root } = SettingsService.getSettings(settings.ROOT);
    let { letterDirectory } = SettingsService.getSettings(settings.ROOT);

    let files = [filename];

    for (let _id of attachmentIds) {
      const { path } = Uploads.findOne({
        _id
      });
      const attachmentPath =
        root + Business.ACCOUNTS_FOLDER + accountId + "/" + path;
      files.push(attachmentPath);
    }

    let newFilename =
      (root + letterDirectory).replace("//", "/") + Random.id() + ".pdf";
    while (existsSync(newFilename)) {
      newFilename =
        (root + letterDirectory).replace("//", "/") + Random.id() + ".pdf";
    }

    PDFMerge(files, newFilename)
      .then(function() {
        renameSync(newFilename, filename);
      })
      .catch(function(error) {
        throw error;
        //returns error
      });
  }
}
