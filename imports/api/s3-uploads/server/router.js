import S3Uploader from './s3';
import middleware from './extensions/busboy.middleware';
import { Accounts } from 'meteor/accounts-base';
import fs from 'fs';

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

        if (params.token) {
            user = getUserByToken(params.token);
        }

        const helper = {
            user,
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
            success() {
                res.end(JSON.stringify({
                    status: 'ok'
                }));
            },
            upload() {
                return _.map(req.filenames, function(filename) {
                    const { resourceType, resourceId } = req.postData;
                    const uploadedFile = S3Uploader.upload(filename);

                    return uploadedFile.save({
                        resourceType,
                        resourceId,
                        userId: user._id
                    });
                });
            }
        };

        handler(helper);
    });
}