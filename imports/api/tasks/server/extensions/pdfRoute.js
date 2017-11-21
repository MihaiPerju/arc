import Tasks from '/imports/api/tasks/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import S3 from '/imports/api/s3-uploads/server/s3';

Picker.route('/pdfs/:_id', function (params, req, res, next) {

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
    PDFMerge(files, {output: `${os.tmpDir()}/nested.pdf`})
        .then((buffer) => {
            console.log("Done! Download here:" + `${os.tmpDir()}/nested.pdf`);
        });
});