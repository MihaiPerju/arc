import Users from '../collection';
import {createRoute} from '/imports/api/s3-uploads/server/router';
import Uploads from '/imports/api/s3-uploads/uploads/collection';

createRoute('/uploads/avatar/:token', ({user, error, filenames, success, uploadLocal}) => {
    if (!user) {
        return error('Not Authorized');
    }

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const [uploadId] = uploadLocal();
    const uploadObject = Uploads.findOne(uploadId);

    if (user.avatar && user.avatar._id) {
        Uploads.remove(user.avatar._id);
    }

    Users.update(user._id, {
        $set: {
            avatar: {
                _id: uploadId,
                path: uploadObject.path,
                thumbs: uploadObject.thumbs
            }
        }
    });

    success();
});