import Accounts from '/imports/api/accounts/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import { getUserByToken } from '/imports/api/s3-uploads/server/router';
import Security from '/imports/api/accounts/security';
import RolesEnum from '/imports/api/users/enums/roles';
import PDFMerge from 'pdf-merge';
import os from 'os';
import Business from '/imports/api/business';

Picker.route('/pdfs/:_id/:token', function(params, req, res, next) {
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

    //Getting attached PDFs from account
    const account = Accounts.findOne({ _id: params._id });
    const { attachmentIds } = account;

    const files = [];
    for (_id of attachmentIds) {
        const { path } = Uploads.findOne({ _id });
        files.push(Business.LOCAL_STORAGE_FOLDER + '/' + path);
    }

    //Merge PDFs
    PDFMerge(files).then(buffer => {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${
                params._id
            }.merged.pdf`,
            'Content-Length': buffer.length
        });
        res.end(buffer);
    });
});
