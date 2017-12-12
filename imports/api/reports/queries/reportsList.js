import Reports from './../collection';

export default Reports.createNamedQuery('reportList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    mongoFilters: 1,
    filterBuilderData: 1,
    allowedRoles: 1,
    createdBy: 1
});