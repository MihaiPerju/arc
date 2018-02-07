import {createRoute} from '/imports/api/s3-uploads/server/router';
import Clients from '/imports/api/clients/collection';

createRoute('/uploads/logo/:clientId/:token', ({user, clientId, error, filenames, success, uploadLocal}) => {
    if (!user) {
        return error('Not Authorized');
    }

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }
    const [uploadId] = uploadLocal();

    Clients.update({_id: clientId}, {
        $set: {
            logoId: uploadId
        }
    });
    success(uploadId);
});