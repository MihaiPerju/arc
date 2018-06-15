import Escalations from "../collection";

export default Escalations.createNamedQuery(
  "escalationList",
  {
    $filter({ filters, options, params }) {
      _.extend(filters, params.filters);
      _.extend(options, params.options);
    },
    $paginate: true,
    open: 1,
    messages: 1
  }
);
