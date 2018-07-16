import ModuleTags from "../collection.js";

export default ModuleTags.createQuery("listModuleTags", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  name: 1,
  moduleNames: 1
});
