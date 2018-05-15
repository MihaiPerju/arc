import Letters from '../collection';

export default Letters.createNamedQuery('letterList', {
    $filter({filters, options, params}) {
        filters.accountId = params.accountId;
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    status: 1,
    createdAt: 1
});