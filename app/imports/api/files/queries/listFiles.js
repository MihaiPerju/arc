import Files from "../collection";

export default Files.createQuery("listFiles", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  fileName: 1,
  status: 1,
  type: 1,
  corruptRows: 1,
  hasHeader: 1,
  createdAt: 1
});
