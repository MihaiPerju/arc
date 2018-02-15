import Users from '../collection';

export default Users.createNamedQuery('singleUser', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    profile: 1,
    emails: 1,
    tagIds: 1
});