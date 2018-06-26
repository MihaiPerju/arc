import LetterTemplates from "./../collection";
import LetterTemplatesListQuery from "./../queries/listLetterTemplates";
import Security from "/imports/api/security/security.js";
import { roleGroups } from "/imports/api/users/enums/roles";

LetterTemplates.expose({
  firewall(filters, options, userId) {
    Security.isAllowed(userId, roleGroups.ADMIN_TECH);
  }
});
LetterTemplatesListQuery.expose({
  firewall(userId, filters) {
    const { expose } = filters;
    if (expose) {
      Security.isAllowed(userId, roleGroups.ADMIN_TECH);
    }
  }
});
