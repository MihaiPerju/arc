import Letters from '../collection.js';
import LetterListQuery from '../queries/letterList.js';
import Security from '/imports/api/security/security.js';
import {roleGroups} from '/imports/api/users/enums/roles';
import LetterGetQuery from '../queries/letterGet.js';

LetterGetQuery.expose({});

Letters.expose({
    firewall(filters, options, userId) {
        Security.isAllowed(userId, roleGroups.ADMIN_TECH_MANAGER);
    }
});
LetterListQuery.expose({
    firewall(userId, params) {
        Security.isAllowed(userId, roleGroups.ADMIN_TECH_MANAGER);
    }
});