import Tasks from '../collection';

export default Tasks.createNamedQuery('taskAttachmentsList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    attachments: {
        _id: 1,
        path: 1,
        name: 1
    }
});