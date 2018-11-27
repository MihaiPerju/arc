import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import RolesEnum from "/imports/api/users/enums/roles";
import Clients from "/imports/api/clients/collection";

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

  static async getClients(filters = {}) {
    const ClientsRaw = Clients.rawCollection();

    ClientsRaw.aggregateSync = Meteor.wrapAsync(ClientsRaw.aggregate);
    let clients = await ClientsRaw.aggregateSync([
      {
        $match: filters
      },
      {
        $lookup: {
          from: "facilities",
          localField: "_id",
          foreignField: "clientId",
          as: "facilities"
        }
      }
    ]).toArray();

    return clients;
  }
}
