import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import RolesEnum from "/imports/api/users/enums/roles";

export default class ClientService {
  static sendNotification(managers, client_id, clientName) {
    if (managers) {
      for (let userId of managers) {
        if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
          NotificationService.createFileUploadNotification(
            userId,
            client_id,
            clientName
          );
        }
      }
    }
  }
}
