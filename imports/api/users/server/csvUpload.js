import {createRoute} from '/imports/api/s3-uploads/server/router';

createRoute('/uploads/csv', ({user, error, filenames, success, upload}) => {

    if (!user) {
        return error('Not Authorized');
    }

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    let read = require('read-file');


    let stream = read.sync(filenames[0]);
    console.log(stream);
});