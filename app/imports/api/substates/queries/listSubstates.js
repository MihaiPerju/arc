import Substates from '../collection';

export default Substates.createNamedQuery('listSubstates', {
    $filter({ filters, options, params }) {
        filters.clientId = params.clientId;
        // filters.status = true;
        options.sort = {stateName: -1}
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    stateName: 1,
    _id: 1,
    description: 1,
    actionIds: 1
});