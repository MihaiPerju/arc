import Letters from "../collection";

export default Letters.createQuery("letterList", {
  $postFilter(results) {
    const letterName = FlowRouter.getQueryParam("letterName");
    if (letterName) {
      return results.filter(letter => {
        return (
          letter.letterTemplate.name.search(new RegExp(letterName, "i")) > -1
        );
      });
    }
    return results;
  },
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
  letterTemplate: {
    name: 1
  },
  body: 1,
  letterValues: 1,
  attachmentIds: 1,
  manualMail: 1
});
