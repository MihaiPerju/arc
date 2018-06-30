import Codes from '../collection';

export default Codes.createQuery('listCodeNames', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    code: 1
});