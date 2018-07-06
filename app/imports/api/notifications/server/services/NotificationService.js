import Notifications from "/imports/api/notifications/collection";
import NotificationTypeEnum from "../../enums/notificationTypes";
import Accounts from "/imports/api/accounts/collection";

export default class NotificationService {
  static createGlobal(receiverId) {
    Notifications.update(
      { receiverId },
      {
        $set: {
          type: NotificationTypeEnum.GLOBAL,
          receiverId,
          message: "Manager responded to escalation",
          seen: false
        }
      },
      { upsert: true }
    );
  }

  static createRespondToEscalation(receiverId, accountId) {
    const { acctNum } = Accounts.findOne({ _id: accountId });
    Notifications.update(
      {
        type: NotificationTypeEnum.RESPONSE,
        receiverId,
        "metaData.accountId": accountId
      },
      {
        $set: {
          receiverId,
          type: NotificationTypeEnum.RESPONSE,
          "metaData.accountId": accountId,
          "metaData.acctNum": acctNum
        }
      },
      { upsert: true }
    );
  }

  static createFlagNotification(receiverId, accountId, flagType) {
    const { acctNum, state } = Accounts.findOne({ _id: accountId });
    Notifications.update(
      {
        type: NotificationTypeEnum.FLAG,
        receiverId,
        "metaData.accountId": accountId,
        "metaData.flagType": flagType,
      },
      {
        $set: {
          receiverId,
          type: NotificationTypeEnum.FLAG,
          "metaData.accountId": accountId,
          "metaData.acctNum": acctNum,
          "metaData.state": state
        }
      },
      { upsert: true }
    );
  }
}
