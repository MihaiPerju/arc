import AccountActions from "../collection";

export default AccountActions.createQuery("accountActionList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  content: 1,
  createdAt: 1,
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
  metaData: 1,
  flagApproved: 1,
  open: 1,
  managerId: 1,
  actionId: 1,
  commentId: 1
});
