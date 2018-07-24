import Reports from "./../collection";

export default Reports.createQuery("reportList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  name: 1,
  mongoFilters: 1,
  filterBuilderData: 1,
  shareReport: 1,
  authorId: 1,
  reportColumns: 1,
  tagIds: 1,
  type: 1
});
