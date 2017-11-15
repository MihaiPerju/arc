import Tasks from '../collection';
import {createRoute} from '/imports/api/s3-uploads/server/router';

createRoute('/uploads/task-pdf/:taskId', ({taskId, error, filenames, success, upload}) => {
    if (!filenames[0].endsWith('.pdf')) {
        return error('Not a valid format');
    }
    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const [uploadId] = upload();

    Tasks.update({_id: taskId}, {
        $push: {
            pdfFiles: uploadId
        }
    });

    success();
});