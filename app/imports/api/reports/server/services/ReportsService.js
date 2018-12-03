import { roleGroups } from "/imports/api/users/enums/roles";

export default class ReportsService {
  static secure(filters, userId) {
    if (Roles.userIsInRole(userId, roleGroups.ADMIN_TECH_MANAGER)) {
      _.extend(filters, {
        $or: [{ shareReport: true }, { authorId: userId }]
      });
    }
  }
}
