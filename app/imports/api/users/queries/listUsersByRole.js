import Users from '../collection';

export default Users.createQuery('listUsersByRole', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    profile: 1,
    roles: 1
});