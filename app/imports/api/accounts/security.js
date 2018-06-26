import Facilities from '/imports/api/facilities/collection.js';
import Accounts from '/imports/api/accounts/collection';
import {roleGroups} from '/imports/api/users/enums/roles';

export default {
    hasRightsOnAccount(userId, accountId) {
        if (Roles.userIsInRole(userId, roleGroups.ADMIN_TECH)) {
            return true;
        }

        const account = Accounts.findOne({_id: accountId});
        const facilityId = account && account.facilityId;
        const facility = Facilities.findOne({_id: facilityId});

        return facility && facility.allowedUsers && facility.allowedUsers.includes(userId)
    }
}