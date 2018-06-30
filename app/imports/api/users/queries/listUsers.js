import Users from '../collection';

export default Users.createQuery('listUsers', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    profile: 1,
    emails: 1,
    _id: 1,
    roles: 1,
    avatar: 1,
    tagIds: 1,
    tags: {
        name: 1
    }
});