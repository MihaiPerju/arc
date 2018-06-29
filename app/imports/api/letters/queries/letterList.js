import Letters from "../collection";

export default Letters.createNamedQuery("letterList", {
  $filter({ filters, options, params }) {
    if (params.accountId) {
      filters.accountId = params.accountId;
    }
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  status: 1,
  createdAt: 1,
  letterTemplateId: 1,
  body: 1,
  letterValues: 1,
  attachmentIds: 1
});
