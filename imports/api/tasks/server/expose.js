import Tasks from "../collection.js";
import TaskListQuery from "./../queries/taskList";
import Facilities from '/imports/api/facilities/collection';
import RolesEnum from '/imports/api/users/enums/roles';

Tasks.expose({});
TaskListQuery.expose({
    firewall(userId, params) {
        if (Roles.userIsInRole(userId, [RolesEnum.REP, RolesEnum.MANAGER])) {
            const userFacilities = Facilities.find({allowedUsers: {$in: [userId]}}, {fields: {_id: 1}}).fetch();

            const userFacilitiesArr = [];

            for (let element of userFacilities) {
                userFacilitiesArr.push(element._id);
            }

            params.filters = {
                facilityId: {
                    $in: userFacilitiesArr
                }
            };
        }
    }
});