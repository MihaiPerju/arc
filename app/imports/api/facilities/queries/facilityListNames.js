import Facilities from '../collection';

export default Facilities.createQuery('facilityListNames', {
    $filter({filters, options, params}) {
        if (params.clientId) {
            filters.clientId = params.clientId;
        }
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    clientId: 1,
    name: 1,
    client: {
        clientName: 1
    }
});