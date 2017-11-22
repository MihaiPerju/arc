import S3 from '/imports/api/s3-uploads/server/s3';
import fs from "fs";
import os from "os";
import path from "path";

export default class PDFService {
    static downloadAndSave(attachments) {
        let files = [];

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
        return files;
    }
}
