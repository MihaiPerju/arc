import Rules from "../collection";

export default Rules.createQuery("listRules", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  name: 1,
  description: 1,
  clientId: 1,
  rule: 1
});
