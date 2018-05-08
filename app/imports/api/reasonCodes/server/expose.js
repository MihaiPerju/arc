import reasonCodesListQuery from "../queries/reasonCodesList";
import RolesEnum from "/imports/api/users/enums/roles";

reasonCodesListQuery.expose({
  firewall(userId, params) {
    if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
      _.extend(params.filters, {
        $or: [{ managerId: userId }, { managerId: null }]
      });
    } else {
      _.extend(params.filters, {
        managerId: null
      });
    }
  }
});
