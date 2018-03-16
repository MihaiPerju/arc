import Tasks from '/imports/api/tasks/collection';
import Actions from '/imports/api/actions/collection';
import ReasonCodes from '/imports/api/reasonCodes/collection';
import TaskActions from '/imports/api/taskActions/collection';
import GeneralEnums from '/imports/api/general/enums';
import { StatesSubstates, findStateBySubstate } from '/imports/api/tasks/enums/states.js';
import { Dispatcher, Events } from '/imports/api/events';

export default class ActionService {

    //Adding action to task
    static createAction (data) {
        const {taskId, actionId, reasonId, userId} = data;
        const action = Actions.findOne({_id: actionId});
        const reason = ReasonCodes.findOne({_id: reasonId});
        const taskActionId = TaskActions.insert({
            userId,
            actionId,
            reasonCode: reason.reason
        });

        Tasks.update({_id: taskId}, {
            $push: {
                actionsLinkData: taskActionId
            }
        });
        Dispatcher.emit(Events.TASK_ACTION_ADDED, {taskId, action});

        this.changeState(taskId, action.substate);

    }

    //Change task state if action have a state
    static changeState (taskId, substate) {

        if (substate && substate !== GeneralEnums.NA) {
            state = findStateBySubstate(StatesSubstates, substate);
            Tasks.update({_id: taskId}, {
                $set: {
                    state: state,
                    substate: substate
                }
            });
        }
    }
}