import Clients from '../collection';

export default Clients.createNamedQuery('listClients', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    clientName: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    financialGoals: 1,
    logoPath: 1,
    contacts: 1,
    status: 1
});