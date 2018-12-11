import middleware from "./extensions/busboy.middleware";
import { Accounts } from "meteor/accounts-base";
import fs from "fs";
import * as Path from "path";
import Uploader from "/imports/api/uploads/server/uploader";
import UploadedFile from "/imports/api/uploads/server/UploadedFile";
import Uploads from "../uploads/collection";
import AccountsCollection from "/imports/api/accounts/collection";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

let postRoutes = Picker.filter(function(req) {
  return req.method == "POST";
});

postRoutes.middleware(middleware);

export function getUserByToken(token) {
  return Meteor.users.findOne({
    "services.resume.loginTokens.hashedToken": Accounts._hashLoginToken(token)
  });
}

/**
 * @param path
 * @param handler
 */
export function createRoute(path, handler) {
  postRoutes.route(path, function(params, req, res, next) {
    let user;
    let { facilityId } = params;
    let { accountId } = params;
    let { clientId } = params;

    if (params.token) {
      user = getUserByToken(params.token);
    }

    const helper = {
      facilityId,
      user,
      accountId,
      clientId,
      req,
      res,
      next,
      params,
      postData: req.postData,
      filenames: req.filenames,
      error(msg = "An error occurred") {
        _.each(req.filenames, filename => {
          fs.unlinkSync(filename);
        });

        res.end(
          JSON.stringify({
            status: "failed",
            msg
          })
        );
      },
      success(uploadId) {
        res.end(
          JSON.stringify({
            status: "ok",
            uploadId
          })
        );
      },
      upload() {
        return _.map(req.filenames, function(filename) {
          const { resourceType, resourceId } = req.postData;
          const uploadedFile = Uploader.upload(filename);

          return uploadedFile.save({
            resourceType,
            resourceId,
            userId: user && user._id
          });
        });
      },
      uploadLocal({ accountId }) {
        return _.map(req.filenames, function(filePath) {
          const { resourceType, resourceId } = req.postData;

          const stats = fs.statSync(filePath);
          const fileSizeInBytes = stats.size;

          const { attachmentIds } =
            AccountsCollection.findOne({
              _id: accountId
            }) || [];

          let fileName = Path.basename(filePath);
          
          if (attachmentIds) {
            const count = Uploads.find({
              name: { $regex: fileName.slice(0, fileName.indexOf(".")) },
              _id: { $in: attachmentIds }
            }).count();

            if (count >= 1) {
              fileName =
                fileName.slice(0, fileName.indexOf(".")) +
                "(" +
                count +
                ")" +
                fileName.slice(fileName.indexOf("."));
            }
          }

          const mimeType = Uploader.guessMimeType(fileName);
          const uploadFile = new UploadedFile(
            fileName,
            filePath,
            mimeType,
            fileSizeInBytes
          );

          return uploadFile.save({
            resourceType,
            resourceId,
            userId: user && user._id
          });
        });
      }
    };

    handler(helper);
  });
}
