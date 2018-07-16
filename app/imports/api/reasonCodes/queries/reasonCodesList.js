import ReasonCodes from '../collection';

export default ReasonCodes.createQuery('reasonCodeList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    reason: 1,
    actionId: 1,
    action: {
        title: 1
    },
    client: {
        clientName: 1
    }
});