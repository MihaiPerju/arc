import Regions from '../collection';

export default Regions.createNamedQuery('regionList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1
});