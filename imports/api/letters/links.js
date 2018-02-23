import Letters from "/imports/api/letters/collection.js";
import Tasks from '/imports/api/tasks/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';

Letters.addLinks({
    task: {
        type: 'one',
        collection: Tasks,
        field: 'taskId'
    },
    attachments: {
        type: 'many',
        collection: Uploads,
        field: 'attachmentIds'
    },
});