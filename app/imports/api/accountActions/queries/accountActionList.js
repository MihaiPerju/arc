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
    $filter({ filters, params }) {
      if (!_.isEmpty(params.userFilter)) {
        _.extend(filters, params.userFilter);
      }
    },
    profile: 1,
    roles: 1
  },
  fileName: 1,
  accountId: 1,
  account: {
    $filter({ filters, params }) {
      if (!_.isEmpty(params.accountFilter)) {
        _.extend(filters, params.accountFilter);
      }
    },
    acctNum: 1,
    state: 1,
    substate: 1
  },
  correctComment: 1,
  customFields: 1
});
