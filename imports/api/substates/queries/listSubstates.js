import Substates from '../collection';

export default Substates.createNamedQuery('listSubstates', {
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