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
          "metaData.accountId": accountId
        }
      },
      { upsert: true }
    );
  }
}
