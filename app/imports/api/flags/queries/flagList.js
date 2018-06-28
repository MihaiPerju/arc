import Flags from "../collection";

export default Flags.createNamedQuery("flagList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  open: 1,
  authorId: 1,
  actionId: 1,
  fields: 1,
  metafields: 1,
  message: 1
});
