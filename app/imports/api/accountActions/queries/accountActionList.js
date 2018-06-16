import AccountActions from "../collection";

export default AccountActions.createNamedQuery("accountActionList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  content: 1,
  createdAt: 1,
  type:1,
  user: {
    profile: {
      firstName: 1,
      lastName: 1
    },
    avatar: {
      path: 1,
      _id: 1
    }
  },
  action: {
    title:1,
    description:1
  }
});
