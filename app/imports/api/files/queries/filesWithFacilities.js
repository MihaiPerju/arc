import Files from "../collection";

export default Files.createQuery("listFilesWithFacilities", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  fileName: 1,
  status: 1,
  type: 1,
  facility: {
    _id: 1,
    placementRules: 1,
    inventoryRules: 1
  }
});
