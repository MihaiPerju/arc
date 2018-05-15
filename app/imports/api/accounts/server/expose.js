import Accounts from "../collection.js";
import AccountListQuery from "../queries/accountList";
import Facilities from "/imports/api/facilities/collection";
import RolesEnum from "/imports/api/users/enums/roles";
import AccountAttachmentsQuery from "/imports/api/accounts/queries/accountAttachmentsList";
import Users from "/imports/api/users/collection";

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
        }
      });
    }
    if (Roles.userIsInRole(userId, RolesEnum.REP)) {
      //Getting tags and accounts from within the work queue
      let { tagIds } = Users.findOne({ _id: userId });
      if (!tagIds) {
        tagIds = [];
      }
      _.extend(params.filters, {
        $or: [{ assigneeId: userId }, { workQueue: { $in: tagIds } }]
      });
    }
  }
});
