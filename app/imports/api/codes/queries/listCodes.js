import Codes from '../collection';

export default Codes.createQuery('listCodes', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    code: 1,
    action: 1,
    type: 1,
    description: 1,
    description_short: 1,
    denial_action: 1
});