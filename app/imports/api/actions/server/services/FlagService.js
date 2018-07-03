import AccountActions from "/imports/api/accountActions/collection";
import Facilities from "/imports/api/facilities/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import RolesEnum from "/imports/api/users/enums/roles";

export default class FlagService {
  static createFlag({ accountId, userId, flagReason, actionId, facilityId }) {
    const flagAction = AccountActions.findOne({
      actionId,
      type: actionTypesEnum.FLAG
    });

    if (flagAction) {
      throw new Meteor.Error("Action can't be flagged again");
    }

    const flagActionData = {
      userId,
      createdAt: new Date(),
      type: actionTypesEnum.FLAG,
      flagReason,
      actionId,
      open: true
    };

    const flagActionId = AccountActions.insert(flagActionData);

    const userActionData = {
      type: actionTypesEnum.USER_ACTION,
      flagActionId
    };

    AccountActions.insert(userActionData);
    this.sendNotification(facilityId, accountId);
  }

  static respondToFlag({ _id, flagResponse, userId, flagApproved }) {
      AccountActions.update(
        { _id },
        {
          $set: {
            open: false,
            managerId: userId,
            flagResponse,
            flagApproved
          }
        }
      );
  }

  static sendNotification(facilityId, accountId) {
    const { allowedUsers } = Facilities.findOne({ _id: facilityId });

    if (allowedUsers) {
      for (let userId of allowedUsers) {
        if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
          NotificationService.createGlobal(userId);
          NotificationService.createFlagNotification(userId, accountId);
        }
      }
    }
  }
}
