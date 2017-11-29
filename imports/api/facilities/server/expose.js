import Facilities from "../collection.js";
import FacilityListQuery from "../queries/facilityList.js";
import Security from '/imports/api/security/security.js';
import {roleGroups} from '/imports/api/users/enums/roles';

Facilities.expose({
    firewall(filters, options, userId) {
        Security.isAllowed(userId, roleGroups.ADMIN_TECH);
    },
});
FacilityListQuery.expose({
    firewall(userId, params) {
        Security.isAllowed(userId, roleGroups.ADMIN_TECH);
    },
});