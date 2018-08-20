import Conditions from '../collection';

export default Conditions.createQuery('listConditions', {
    $filter({
        filters,
        options,
        params
    }) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    type: 1,
});