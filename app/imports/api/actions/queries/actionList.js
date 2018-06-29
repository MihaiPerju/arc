import Actions from '../collection';

export default Actions.createQuery('actionList', {
    $filter({filters, options, params}) {
        filters.systemAction = false;
        filters.title = {$ne: "Escalated"};
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    title: 1,
    description: 1,
    substateId: 1,
    inputs: 1
});