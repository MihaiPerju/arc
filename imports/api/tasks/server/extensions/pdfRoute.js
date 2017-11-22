import Tasks from '/imports/api/tasks/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import {getUserByToken} from '/imports/api/s3-uploads/server/router';
import Security from '/imports/api/tasks/security';
import RolesEnum from '/imports/api/users/enums/roles';
import PDFMerge from 'pdf-merge';
import PDFService from '/imports/api/tasks/server/extensions/PDFService';

Picker.route('/pdfs/:_id/:token', function (params, req, res, next) {

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

    //Getting attached PDFs from task
    const task = Tasks.findOne({_id: params._id});
    const {attachmentIds} = task;
    const attachments = Uploads.find({_id: {$in: attachmentIds}}).fetch();

    //Downloading and saving PDFs to local files
    let files = PDFService.downloadAndSave(attachments);

    //Merge PDFs
    PDFMerge(files)
        .then((buffer) => {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${params._id}.merged.pdf`,
                'Content-Length': buffer.length
            });
            res.end(buffer);
        });

});