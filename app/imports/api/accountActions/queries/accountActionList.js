import AccountActions from "../collection";

export default AccountActions.createQuery("accountActionList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  content: 1,
  createdAt: 1,
  type: 1,
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
    title: 1,
    description: 1
  },
  letterTemplate: {
    name: 1
  },
  type: 1,
  flagReason: 1,
  flagResponse: 1,
  createdAt: 1,
  userId: 1,
  managerId: 1,
  manager: {
    profile: 1
  },
  isFlagApproved: 1,
  actionId: 1,
  isOpen: 1,
  commentId: 1,
  content: 1,
  user: {
    profile: 1
  }
});
