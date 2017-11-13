import Actions from '../collection';

export default Actions.createNamedQuery('actionList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    title: 1,
    description: 1,
    state: 1
});