import Tasks from "../collection.js";
import TaskListQuery from "./../queries/taskList";
import Facilities from '/imports/api/facilities/collection';
import RolesEnum from '/imports/api/users/enums/roles';
import TaskAttachmentsQuery from "/imports/api/tasks/queries/taskAttachmentsList";
import Users from "/imports/api/users/collection";

Tasks.expose({});
TaskAttachmentsQuery.expose({});

TaskListQuery.expose({
    firewall(userId, params) {
        const userFacilities = Facilities.find({
                allowedUsers: {$in: [userId]}
            },
            {fields: {_id: 1}})
            .fetch();

        let userFacilitiesArr = [];

        for (let element of userFacilities) {
            userFacilitiesArr.push(element._id);
        }

        if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {

            _.extend(params, {
                filters: {
                    facilityId: {
                        $in: userFacilitiesArr
                    }
                }
            });
        }
        if (Roles.userIsInRole(userId, RolesEnum.REP)) {
            //Getting tags and accounts from within the work queue
            let {tagIds} = Users.findOne({_id: userId});

            if (!tagIds) {
                tagIds = [];
            }
            _.extend(params, {
                filters: {
                    $or: [
                        {assigneeId: userId},
                        {workQueue: {$in: tagIds}}
                    ]
                }
            });
        }
    }
});