import Letters from '../collection';

export default Letters.createNamedQuery('letterGet', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    attachments: {
        name: 1,
        path: 1
    },
    body: 1
});