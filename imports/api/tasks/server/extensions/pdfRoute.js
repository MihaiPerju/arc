import Tasks from '/imports/api/tasks/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import S3 from '/imports/api/s3-uploads/server/s3';
import {getUserByToken} from '/imports/api/s3-uploads/server/router';
import Security from '/imports/api/tasks/security';
import RolesEnum from '/imports/api/users/enums/roles';

Picker.route('/pdfs/:_id/:token', function (params, req, res, next) {

    //Checking user rights
    const user = getUserByToken(params.token);
    if (!user) {
        return;
    }
    if (!Roles.userIsInRole(user._id, [RolesEnum.ADMIN, RolesEnum.TECH]) && !Security.allowedUploadPdf(user._id, params._id)) {
        return;
    }

    //Getting attached PDFs from task
    const task = Tasks.findOne({_id: params._id});
    const {attachmentIds} = task;
    const attachments = Uploads.find({_id: {$in: attachmentIds}}).fetch();
    let files = [];

    //Downloading and saving PDFs to local files
    let fs = Npm.require("fs"), os = Npm.require("os"), path = Npm.require("path");
    for (attachment of attachments) {
        //Getting path and downloading from S3
        const pdfPath = attachment.path;
        const pdf = S3.getObject(pdfPath);

        //Generating unique links to files
        let filename = `documents.pdf?token=${attachment._id}`;
        let saveTo = path.join(os.tmpDir(), filename);

        //Saving paths for further downloading
        files.push(saveTo);

        //Extracting buffer and saving to link
        const buffer = pdf.Body;
        fs.writeFile(saveTo, buffer);
    }

    //Merge PDFs
    const PDFMerge = require('pdf-merge');
    PDFMerge(files)
        .then((buffer) => {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=nested.pdf',
                'Content-Length': buffer.length
            });
            res.end(buffer);
        });

});