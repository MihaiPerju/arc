import LetterTemplates from '../collection';

export default LetterTemplates.createNamedQuery('listLetterTemplates', {
    $filter({filters, options, params}) {
        filters.clientId = params.clientId;
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
<<<<<<< 221dae6361f3197b9f73d80d417e4730f037cb65
    content: 1,
    codes: {
        code: 1
    }
=======
    body: 1,
    description: 1,
    keywords: 1
>>>>>>> integrated letter creation in account view
});