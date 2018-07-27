import Tickles from "../collection";

export default Tickles.createQuery("tickleList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  open: 1,
  messages: 1
});
