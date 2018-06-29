import Clients from '../collection';

export default Clients.createQuery('clientsWithFacilities', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    clientName: 1,
    email: 1,
    facilities: {
        name: 1
    }
});