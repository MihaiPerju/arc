import Notifications from "/imports/api/notifications/collection";
import NotificationTypeEnum from "../../enums/notificationTypes";
import Accounts from "/imports/api/accounts/collection";
import Reports from "/imports/api/reports/collection";

export default class NotificationService {
  static createGlobal(receiverId) {
    Notifications.update(
      { receiverId },
      {
        $set: {
          type: NotificationTypeEnum.GLOBAL,
          receiverId,
          message: "Manager responded to escalation",
          seen: false,
          createdAt: new Date()
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
        "metadata.accountId": accountId
      },
      {
        $set: {
          receiverId,
          type: NotificationTypeEnum.RESPONSE,
          "metadata.accountId": accountId,
          "metadata.acctNum": acctNum,
          "metadata.state": "escalated", // the reponse notifications will be always for escalated acounts 
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  static createReportNotification(receiverId, reportId) {
    const { name } = Reports.findOne({ _id: reportId });
    Notifications.update(
      {
        type: NotificationTypeEnum.REPORT,
        receiverId,
        "metadata.reportId": reportId
      },
      {
        $set: {
          receiverId,
          type: NotificationTypeEnum.REPORT,
          "metadata.reportId": reportId,
          "metadata.name": name,
          createdAt: new Date()
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
        "metadata.accountId": accountId,
        "metadata.flagType": flagType
      },
      {
        $set: {
          receiverId,
          type: NotificationTypeEnum.FLAG,
          "metadata.accountId": accountId,
          "metadata.acctNum": acctNum,
          "metadata.state": state,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  static createCommentNotification(receiverId, accountId) {
    const { acctNum, state } = Accounts.findOne({ _id: accountId });
    Notifications.update(
      {
        type: NotificationTypeEnum.COMMENT,
        receiverId,
        "metadata.accountId": accountId,
        "metadata.state": state,
        "metadata.acctNum": acctNum
      },
      {
        $set: {
          receiverId,
          type: NotificationTypeEnum.COMMENT,
          "metadata.accountId": accountId,
          "metadata.acctNum": acctNum,
          "metadata.state": state,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
  }
  static createFileUploadNotification(receiverId, clientId, clientName) {
    Notifications.update(
      {
        type: NotificationTypeEnum.FILEUPLOAD,
        receiverId,
      },
      {
        $set: {
          receiverId,
          type: NotificationTypeEnum.FILEUPLOAD,
          "metadata.client_id": clientId,
          "metadata.client_id": clientId,
          message: `A new file has been uploaded for the client ${clientName}`,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
  }
}
