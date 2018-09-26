import {
    createRoute
} from '/imports/api/uploads/server/router';
import Facilities from "../../facilities/collection";
import Uploads from '/imports/api/uploads/uploads/collection';
import Security from '/imports/api/security/security.js';
import Settings from "/imports/api/settings/collection.js";
import fs from "fs";
import Business from "/imports/api/business";

createRoute('/uploads/facility-logo/:facilityId/:token', ({
    user,
    facilityId,
    error,
    filenames,
    success,
    uploadLocal
}) => {

    if (!user) {
        return error("Not logged in!");
    }
    Security.isAdminOrTech(user._id);

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const [uploadId] = uploadLocal({});


    const {
        rootFolder
    } = Settings.findOne({
        rootFolder: {
            $ne: null
        }
    });

    const {
        path
    } = Uploads.findOne({
        _id: uploadId
    });

    const movePath = rootFolder + Business.CLIENTS_FOLDER + path;
    fs.renameSync(rootFolder + path, movePath);

    Facilities.update({
        _id: facilityId
    }, {
        $set: {
            logoPath: path
        }
    });

    success();
});