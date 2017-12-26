import {createRoute} from '/imports/api/s3-uploads/server/router';
import Facilities from "../../facilities/collection";
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import Security from '/imports/api/security/security.js';

createRoute('/uploads/facility-logo/:facilityId/:token', ({user, facilityId, error, filenames, success, upload}) => {

    if (!user) {
        return error("Not logged in!");
    }
    Security.isAdminOrTech(user._id);

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const [uploadId] = upload();
    const uploadFile = Uploads.findOne({_id: uploadId});

    Facilities.update({_id: facilityId}, {
        $set: {
            logoPath: uploadFile.path
        }
    });

    success();
});