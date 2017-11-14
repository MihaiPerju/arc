import Tasks from '../collection';
import {createRoute} from '/imports/api/s3-uploads/server/router';
import Uploads from '/imports/api/s3-uploads/uploads/collection';

createRoute('/uploads/task-pdf/:token', ({user, error, filenames, success, upload}) => {
    if (!user) {
        return error('Not Authorized');
    }

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const [uploadId] = upload();
    console.log(uploadId);

    success();
});