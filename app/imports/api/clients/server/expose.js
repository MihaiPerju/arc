import Clients from './../collection';
import ClientListQuery from './../queries/listClients';
import ClientsWithFacilitiesQuery from './../queries/clientsWithFacilites';
import RolesEnum from "/imports/api/users/enums/roles";

Clients.expose({});

ClientListQuery.expose({
    firewall(userId, params) {
        if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
            _.extend(params.filters, {
                managerIds: { $in: [userId] }
            })
        }
    }
});
ClientsWithFacilitiesQuery.expose({});