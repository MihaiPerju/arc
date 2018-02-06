import S3Uploader from './s3';
import middleware from './extensions/busboy.middleware';
import {Accounts} from 'meteor/accounts-base';
import fs from 'fs';
import Uploader from '/imports/api/s3-uploads/server/s3';
import UploadedFile from '/imports/api/s3-uploads/server/UploadedFile';

let postRoutes = Picker.filter(function (req, res) {
    return req.method == "POST";
});

postRoutes.middleware(middleware);

export function getUserByToken(token) {
    return Meteor.users.findOne({
        'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token)
    });
}

/**
 * @param path
 * @param handler
 */
export function createRoute(path, handler) {
    postRoutes.route(path, function (params, req, res, next) {
        let user;
        let facilityId = params.facilityId;
        let taskId = params.taskId;

        if (params.token) {
            user = getUserByToken(params.token);
        }

        const helper = {
            facilityId,
            user,
            taskId,
            req,
            res,
            next,
            params,
            postData: req.postData,
            filenames: req.filenames,
            error(msg = 'An error occurred') {
                _.each(req.filenames, filename => {
                    fs.unlinkSync(filename);
                });

                res.end(JSON.stringify({
                    status: 'failed',
                    msg
                }));
            },
            success(uploadId) {
                res.end(JSON.stringify({
                    status: 'ok',
                    uploadId
                }));
            },
            upload() {
                return _.map(req.filenames, function (filename) {
                    const {resourceType, resourceId} = req.postData;
                    uploadId = resourceId;
                    const uploadedFile = S3Uploader.upload(filename);

                    return uploadedFile.save({
                        resourceType,
                        resourceId,
                        userId: user && user._id
                    });
                });
            },
            uploadLocal() {
                return _.map(req.filenames, function (filePath) {
                    const {resourceType, resourceId} = req.postData;

                    let fs = Npm.require('fs');
                    let os = Npm.require("os");

                    const stats = fs.statSync(filePath);
                    const fileSizeInBytes = stats.size;

                    let fileName = filePath.replace(os.tmpDir() + '/', '');
                    const mimeType = Uploader.guessMimeType(fileName);
                    const uploadFile = new UploadedFile(fileName, filePath, mimeType, fileSizeInBytes);

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