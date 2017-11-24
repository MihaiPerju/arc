import Letters from "/imports/api/letters/collection.js";
import Tasks from '/imports/api/tasks/collection';

Letters.addLinks({
    task: {
        type: 'one',
        collection: Tasks,
        field: 'taskId'
    }
});