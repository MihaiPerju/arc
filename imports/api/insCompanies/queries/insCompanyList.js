import insCompanies from '../collection';

export default insCompanies.createNamedQuery('insCompaniesList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    aliases: 1
});