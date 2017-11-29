import LetterTemplates from '../collection';

export default LetterTemplates.createNamedQuery('listLetterTemplates', {
    $filter({filters, options, params}) {
        filters.clientId = params.clientId;
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    content: 1
});