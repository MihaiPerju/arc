import Tasks from '/imports/api/tasks/collection';
import Actions from '/imports/api/actions/collection';
import GeneralEnums from '/imports/api/general/enums';
import {StatesSubstates, findStateBySubstate} from '/imports/api/tasks/enums/states.js';
import { Dispatcher, Events } from '/imports/api/events';

export default class ActionService {

    //Adding action to task
    static createAction(taskId, actionId, userId) {
        const action = Actions.findOne({_id: actionId});

        Tasks.update({_id: taskId}, {
            $addToSet: {
                actionsLinkData: {
                    _id: actionId,
                    title: action.title,
                    createdAt: new Date(),
                    userId: userId
                }
            }
        });
        Dispatcher.emit(Events.TASK_ACTION_ADDED, {taskId, action});

        this.changeState(taskId, action.substate);
    }

    //Change task state if action have a state
    static changeState(taskId, substate) {

        if (substate && substate !== GeneralEnums.NA) {
            state = findStateBySubstate(StatesSubstates, substate);
            Tasks.update({_id: taskId}, {
                $set: {
                    state: state,
                    substate: substate
                }
            })
        }
    }
}