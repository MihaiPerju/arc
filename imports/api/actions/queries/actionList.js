import Actions from '../collection';

export default Actions.createNamedQuery('actionList', {
    $filter({filters, options, params}) {
        filters.systemAction = false;
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    title: 1,
    description: 1,
    substate: 1,
});