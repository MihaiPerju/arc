import Flags from "../../collection";
import AccountActions from "/imports/api/accountActions/collection";
import Accounts from "/imports/api/accounts/collection";
import Facilities from "/imports/api/facilities/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import RolesEnum from "/imports/api/users/enums/roles";

export default class FlagService {
  static createFlag({ accountId, userId, flagReason, actionId, facilityId }) {
    const flagAction = AccountActions.findOne({
      actionId,
      type: actionTypesEnum.USER_ACTION
    });

    if (flagAction) {
      throw new Meteor.Error("Action can't be flagged again");
    }

    const userActionData = {
      userId,
      createdAt: new Date(),
      type: actionTypesEnum.USER_ACTION,
      actionId,
      metaData: {
        flagReason
      },
      open: true
    };

    AccountActions.insert(userActionData);
    this.sendNotification(facilityId, accountId);
  }

  static respondToFlag({ _id, flagResponse, userId, flagApproved }) {
    const flagAction = AccountActions.findOne({ _id });

    if (flagAction) {
      AccountActions.update(
        { _id },
        {
          $set: {
            open: false
          }
        }
      );

      const { metaData } = flagAction;
      const flagActionData = {
        userId,
        createdAt: new Date(),
        type: actionTypesEnum.FLAG,
        metaData: {
          flagReason: metaData.flagReason,
          flagResponse
        },
        flagApproved
      };

      AccountActions.insert(flagActionData);
    }
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
