import S3Uploader from "./s3";
import middleware from "./extensions/busboy.middleware";
import { Accounts } from "meteor/accounts-base";
import fs from "fs";
import Uploader from "/imports/api/s3-uploads/server/s3";
import UploadedFile from "/imports/api/s3-uploads/server/UploadedFile";
import Uploads from "../uploads/collection";
import AccountsCollection from "/imports/api/accounts/collection";
import Settings from "/imports/api/settings/collection.js";

let postRoutes = Picker.filter(function(req, res) {
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
          uploadId = resourceId;
          const uploadedFile = S3Uploader.upload(filename);

          return uploadedFile.save({
            resourceType,
            resourceId,
            userId: user && user._id
          });
        });
      },
      uploadLocal(accountId) {
        return _.map(req.filenames, function(filePath) {
          const { resourceType, resourceId } = req.postData;

          let fs = Npm.require("fs");
          let os = Npm.require("os");

          const stats = fs.statSync(filePath);
          const fileSizeInBytes = stats.size;

          const { attachmentIds } =
            AccountsCollection.findOne({
              _id: accountId
            }) || [];
          let fileName = filePath.replace(os.tmpdir() + "/", "");
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

          const { rootFolder } = Settings.findOne({
            rootFolder: { $ne: null }
          });
          let movePath = rootFolder + fileName;
          movePath = movePath.replace(/\s+/g, "-");
          //If there is no local folder
          if (!fs.existsSync(rootFolder)) {
            fs.mkdirSync(rootFolder);
          }
          //Move file to specified storage folder
          fs.renameSync(filePath, movePath);
          filePath = movePath.replace(rootFolder, "");

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
