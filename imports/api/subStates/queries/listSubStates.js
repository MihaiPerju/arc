import SubStates from '../collection';

export default SubStates.createNamedQuery('listSubStates', {
    $filter({ filters, options, params }) {
        filters.clientId = params.clientId;
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    stateName: 1,
    _id: 1
});