import Uploads from '/imports/api/s3-uploads/uploads/collection';
import {getUserByToken} from '/imports/api/s3-uploads/server/router';
import Security from '/imports/api/tasks/security';
import RolesEnum from '/imports/api/users/enums/roles';
import fs from 'fs';

Picker.route('/pdf/:_id/:token', function (params, req, res, next) {
    //Checking user rights
    const user = getUserByToken(params.token);
    if (!user) {
        res.writeHead(404);
        res.write("Not logged in!");
    }
    if (!Roles.userIsInRole(user._id, [RolesEnum.ADMIN, RolesEnum.TECH]) && !Security.hasRightsOnTask(user._id, params._id)) {
        res.writeHead(404);
        res.write("An error occurred");
    }

    const attachment = Uploads.findOne({_id: params._id});
    const pdfPath = attachment.path;
    var data = fs.readFileSync(pdfPath);

    res.end(data);
});