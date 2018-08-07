import AccountActions from "/imports/api/accountActions/collection";
import Facilities from "/imports/api/facilities/collection";
import Accounts from "/imports/api/accounts/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import RolesEnum from "/imports/api/users/enums/roles";
import flagTypesEnum from "/imports/api/accounts/enums/flagTypesEnum";

export default class FlagService {
  static flagAction({ accountId, userId, flagReason, actionId, facilityId }) {
    const flagAction = AccountActions.findOne({
      actionId,
      type: actionTypesEnum.FLAG
    });

    if (flagAction) {
      throw new Meteor.Error("Action can't be flagged again");
    }

    const { clientId } = Accounts.findOne({ _id: accountId });
    const flagActionData = {
      userId,
      createdAt: new Date(),
      type: actionTypesEnum.FLAG,
      flagReason,
      actionId,
      isOpen: true,
      accountId,
      clientId
    };
    this.createFlag(
      flagActionData,
      accountId,
      facilityId,
      flagTypesEnum.ACTION
    );
  }

  static flagComment({ accountId, userId, flagReason, commentId, facilityId }) {
    const flagAction = AccountActions.findOne({
      commentId,
      type: actionTypesEnum.FLAG
    });

    if (flagAction) {
      throw new Meteor.Error("Comment can't be flagged again");
    }

    const { clientId } = Accounts.findOne({ _id: accountId });
    const flagActionData = {
      userId,
      createdAt: new Date(),
      type: actionTypesEnum.FLAG,
      flagReason,
      commentId,
      isOpen: true,
      accountId,
      clientId
    };
    this.createFlag(
      flagActionData,
      accountId,
      facilityId,
      flagTypesEnum.COMMENT
    );
  }

  static createFlag(flagActionData, accountId, facilityId, flagType) {
    const flagActionId = AccountActions.insert(flagActionData);
    const userActionData = {
      type: actionTypesEnum.USER_ACTION,
      flagActionId
    };

    const userActionId = AccountActions.insert(userActionData);

    Accounts.update(
      { _id: accountId },
      {
        $push: {
          flagIds: userActionId
        },
        $inc: {
          flagCounter: 1
        }
      }
    );

    this.sendNotification(facilityId, accountId, flagType);
  }

  static respondToFlag({ _id, flagResponse, managerId, isFlagApproved }) {
    AccountActions.update(
      { _id },
      {
        $set: {
          isOpen: false,
          managerId,
          flagResponse,
          isFlagApproved
        }
      }
    );
    const { accountId } = AccountActions.findOne({ _id });
    Accounts.update(
      { _id: accountId },
      {
        $inc: {
          flagCounter: -1
        }
      }
    );
  }

  static sendNotification(facilityId, accountId, flagType) {
    const { allowedUsers } = Facilities.findOne({ _id: facilityId });
    if (allowedUsers) {
      for (let userId of allowedUsers) {
        if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
          NotificationService.createGlobal(userId);
          NotificationService.createFlagNotification(
            userId,
            accountId,
            flagType
          );
        }
      }
    }
  }
}
