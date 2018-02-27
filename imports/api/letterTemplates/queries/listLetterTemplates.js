import LetterTemplates from '../collection';

export default LetterTemplates.createNamedQuery('listLetterTemplates', {
    $filter({filters, options, params}) {
        filters.clientId = params.clientId;
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
<<<<<<< 5c830ba22fd3d5c902f3d9c5b2980a10c4206cc6
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
=======
    body: 1,
    description: 1,
    keywords: 1
>>>>>>> obtained reactivity on account level
});