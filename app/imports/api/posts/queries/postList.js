import Posts from '../collection';

export default Posts.createNamedQuery('postList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    profile: 1,
    title: 1,
    content: 1,
    createdAt: 1,
    user: {
        profile: 1,
        emails: 1
    }
});