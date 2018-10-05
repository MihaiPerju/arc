import Facilities from "../collection.js";
import FacilityListQuery from "../queries/facilityList.js";
import FacilityListNamesQuery from "../queries/facilityListNames.js";
import Security from '/imports/api/security/security.js';
import {roleGroups} from '/imports/api/users/enums/roles';

Facilities.expose({
    firewall(filters, options, userId) {
        Security.isAllowed(userId, roleGroups.ADMIN_TECH_MANAGER);
    },
});
FacilityListQuery.expose({
    firewall(userId) {
        Security.isAllowed(userId, roleGroups.ADMIN_TECH_MANAGER);
    },
});
FacilityListNamesQuery.expose({
    firewall(userId) {
        Security.isAllowed(userId, roleGroups.ADMIN_TECH_MANAGER);
    },
});