import Facilities from '../collection';

export default Facilities.createNamedQuery('facilityList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    clientId: 1,
    name: 1,
    state: 1,
    addressOne: 1,
    addressTwo: 1,
    region: 1,
    status: 1
});