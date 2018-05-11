import Uploads from '/imports/api/s3-uploads/uploads/collection';
import { getUserByToken } from '/imports/api/s3-uploads/server/router';
import Security from '/imports/api/accounts/security';
import RolesEnum from '/imports/api/users/enums/roles';
import fs from 'fs';
import os from 'os';
import Business from '/imports/api/business';

Picker.route('/pdf/:_id/:token', function(params, req, res, next) {
    //Checking user rights
    const user = getUserByToken(params.token);
    if (!user) {
        res.writeHead(404);
        res.write('Not logged in!');
    }
    if (
        !Roles.userIsInRole(user._id, [RolesEnum.ADMIN, RolesEnum.TECH]) &&
        !Security.hasRightsOnAccount(user._id, params._id)
    ) {
        res.writeHead(404);
        res.write('An error occurred');
    }
    const { _id } = params;
    const { path } = Uploads.findOne({ _id });
    let data = fs.readFileSync(Business.LOCAL_STORAGE_FOLDER + '/' + path);

    res.end(data);
});
