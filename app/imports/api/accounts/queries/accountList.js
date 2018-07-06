import Accounts from "../collection";

export default Accounts.createQuery("accountList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  acctNum: 1,
  facCode: 1,
  ptType: 1,
  ptName: 1,
  tickleDate: 1,
  dischrgDate: 1,
  collectedAmount: 1,
  fbDate: 1,
  acctBal: 1,
  finClass: 1,
  admitDate: 1,
  medNo: 1,
  insName: 1,
  insurances: 1,
  insName2: 1,
  insName3: 1,
  insCode: 1,
  insCode2: 1,
  insCode3: 1,
  insBal: 1,
  insBal2: 1,
  insBal3: 1,
  state: 1,
  substate: 1,
  facilityId: 1,
  facility: {
    name: 1,
    users: {
      profile: 1,
      roles: 1
    },
    files: {
      $filter({ filters, params }) {
        if (!_.isEmpty(params.actionsFilter)) {
          _.extend(filters, params.actionsFilter);
        }
      },
      userId: 1,
      createdAt: 1,
      type: 1,
      status: 1,
      fileName: 1,
      user: {
        $filter({ filters, params }) {
          if (!_.isEmpty(params.userFilter)) {
            _.extend(filters, params.userFilter);
          }
        },
        profile: 1,
        roles: 1
      }
    }
  },
  assigneeId: 1,
  assignee: {
    profile: {
      firstName: 1,
      lastName: 1
    },
    emails: 1
  },
  client: {
    clientName: 1
  },
  attachments: {
    _id: 1,
    path: 1,
    name: 1
  },
  actions: {
    $filter({ filters, params }) {
      if (!_.isEmpty(params.actionsFilter)) {
        _.extend(filters, params.actionsFilter);
      }
    },
    reasonCode: 1,
    userId: 1,
    action: {
      title: 1
    },
    user: {
      $filter({ filters, params }) {
        if (!_.isEmpty(params.userFilter)) {
          _.extend(filters, params.userFilter);
        }
      },
      profile: 1,
      roles: 1
    },
    createdAt: 1,
    status: 1,
    type: 1,
    $options: { sort: { createdAt: -1 } }
  },
  metaData: 1,
  escalationId: 1,
  workQueue: 1,
  tag: {
    name: 1
  },
  invoiceNo: 1,
  activeInsCode: 1,
  activeInsName: 1,
  createdAt: 1,
  comments: {
    $filter({ filters, params }) {
      if (!_.isEmpty(params.actionsFilter)) {
        _.extend(filters, params.actionsFilter);
      }
    },
    content: 1,
    createdAt: 1,
    type: 1,
    userId: 1,
    user: {
      $filter({ filters, params }) {
        if (!_.isEmpty(params.userFilter)) {
          _.extend(filters, params.userFilter);
        }
      },
      profile: 1,
      roles: 1
    }
  },
  letters: {
    $filter({ filters, params }) {
      if (!_.isEmpty(params.actionsFilter)) {
        _.extend(filters, params.actionsFilter);
      }
    },
    createdAt: 1,
    type: 1,
    userId: 1,
    status: 1,
    letterTemplate: {
      name: 1
    },
    user: {
      $filter({ filters, params }) {
        if (!_.isEmpty(params.userFilter)) {
          _.extend(filters, params.userFilter);
        }
      },
      profile: 1,
      roles: 1
    }
  },
  flags: {
    type: 1,
    flagActionId: 1,
    flagAction: {
      $filter({ filters, params }) {
        if (!_.isEmpty(params.actionsFilter)) {
          _.extend(filters, params.actionsFilter);
        }
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
      }
    }
  }
});
