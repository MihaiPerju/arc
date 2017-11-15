import Comments from '../collection';

export default Comments.createNamedQuery('listComments', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    reactive: true,
    content: 1,
    authorId: 1,
    taskId: 1,
    author: {
        profile: {
            firstName: 1,
            lastName: 1
        },
        avatar: {
            path: 1
        }
    }
});