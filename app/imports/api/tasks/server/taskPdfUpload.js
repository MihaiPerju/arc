import Tasks from '../collection';
import {createRoute} from '/imports/api/s3-uploads/server/router';
import RolesEnum from '/imports/api/users/enums/roles';
import Security from '/imports/api/tasks/security';

createRoute('/uploads/task-pdf/:taskId/:token', ({user, taskId, error, filenames, success, uploadLocal}) => {
    if (!user) {
        return error("Not logged in!");
    } else if (!Roles.userIsInRole(user._id, [RolesEnum.ADMIN, RolesEnum.TECH]) && !Security.hasRightsOnTask(user._id, taskId)) {
        return error("Not allowed!");
    }

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const [uploadId] = uploadLocal();

    Tasks.update({_id: taskId}, {
        $push: {
            attachmentIds: uploadId
        }
    });
    success();
});