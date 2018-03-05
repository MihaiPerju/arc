import Facilities from '../collection';

export default Facilities.createNamedQuery('facilityList', {
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
    state: 1,
    city: 1,
    zipCode: 1,
    addressOne: 1,
    addressTwo: 1,
    regionId: 1,
    status: 1,
    placementRules: 1,
    inventoryRules: 1,
    paymentRules: 1,
    sftpPath: 1,
    allowedUsers: 1
});