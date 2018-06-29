import Flags from "../../collection";
import AccountActions from "/imports/api/accountActions/collection";
import Accounts from "/imports/api/accounts/collection";
import Facilities from "/imports/api/facilities/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import RolesEnum from "/imports/api/users/enums/roles";

export default class FlagService {
  static createFlag(data) {
    const { accountId, authorId, flagReason, actionId, facilityId } = data;
    const flag = Flags.findOne({ actionId });
    if (flag) {
      throw new Meteor.Error("Action can't be flagged again");
    }
    delete data.facilityId;
    const flagId = Flags.insert(data);
    const userActionData = {
      flagId,
      userId: authorId,
      createdAt: new Date(),
      type: actionTypesEnum.USER_ACTION,
      metaData: {
        flagReason
      }
    };

    AccountActions.insert(userActionData);

    const flagActionData = {
      flagId,
      userId: authorId,
      createdAt: new Date(),
      type: actionTypesEnum.FLAG,
      metaData: {
        flagReason
      }
    };

    AccountActions.insert(flagActionData);
    this.sendNotification(facilityId, accountId);
  }

  static respondToFlag({ _id, flagResponse, managerId, flagApproved }) {
    Flags.update(
      { _id },
      {
        $set: {
          flagResponse,
          managerId,
          open: false
        }
      }
    );

    const flagAction = AccountActions.findOne({
      flagId: _id,
      type: actionTypesEnum.FLAG
    });

    if (flagAction) {
      const { flagReason } = flagAction.metaData;
      const metaData = {
        flagReason,
        flagResponse
      };

      AccountActions.update(
        { flagId: _id, type: actionTypesEnum.FLAG },
        { $set: { metaData, flagApproved } }
      );
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
