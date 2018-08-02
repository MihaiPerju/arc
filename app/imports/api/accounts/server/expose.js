import Accounts from "../collection.js";
import AccountListQuery from "../queries/accountList";
import Facilities from "/imports/api/facilities/collection";
import RolesEnum from "/imports/api/users/enums/roles";
import AccountAttachmentsQuery from "/imports/api/accounts/queries/accountAttachmentsList";
import Users from "/imports/api/users/collection";
import FlaggedAccountListQuery from "../queries/flaggedAccountList";
import AccountActions from "/imports/api/accountActions/collection";

Accounts.expose({});
AccountAttachmentsQuery.expose({});

AccountListQuery.expose({
  firewall(userId, params) {
    const userFacilities = Facilities.find(
      {
        allowedUsers: { $in: [userId] }
      },
      { fields: { _id: 1 } }
    ).fetch();

    let userFacilitiesArr = [];
    for (let element of userFacilities) {
      userFacilitiesArr.push(element._id);
    }

    if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
      _.extend(params.filters, {
        facilityId: {
          $in: userFacilitiesArr
        },
        $or: [
          { employeeToRespond: null },
          { employeeToRespond: RolesEnum.MANAGER }
        ]
      });
    }
    if (Roles.userIsInRole(userId, RolesEnum.REP)) {
      //Getting tags and accounts from within the work queue
      let { tagIds } = Users.findOne({ _id: userId });

      //Getting only the escalated accounts that are open and the rep is the author
      if (!tagIds) {
        tagIds = [];
      }
      _.extend(params.filters, {
        $and: [
          {
            $or: [{ assigneeId: userId }, { workQueue: { $in: tagIds } }]
          },
          {
            $or: [{ employeeToRespond: null }, { employeeToRespond: userId }]
          }
        ]
      });
    }
  }
});

FlaggedAccountListQuery.expose({
  firewall(userId, params) {
    const userFacilities = Facilities.find(
      {
        allowedUsers: { $in: [userId] }
      },
      { fields: { _id: 1, clientId: 1 } }
    ).fetch();

    let userFacilitiesArr = [],
      clientIds = [],
      flaggedAccountIds = [];
    for (let element of userFacilities) {
      userFacilitiesArr.push(element._id);
      clientIds.push(element.clientId);
    }

    clientIds = [...new Set(clientIds)];

    const flaggedAccounts = AccountActions.find(
      {
        clientId: { $in: clientIds },
        type: "flag",
        managerId: { $exists: false }
      },
      { fields: { accountId: 1, _id: 0 } }
    ).fetch();

    flaggedAccountIds = flaggedAccounts.map(account => account.accountId);
    flaggedAccountIds = [...new Set(flaggedAccountIds)];

    _.extend(params.filters, {
      facilityId: {
        $in: userFacilitiesArr
      },
      _id: { $in: flaggedAccountIds },
      $or: [
        { employeeToRespond: null },
        { employeeToRespond: RolesEnum.MANAGER }
      ]
    });
  }
});
