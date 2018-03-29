import Accounts from '/imports/api/tasks/collection';
import Actions from '/imports/api/actions/collection';
import ReasonCodes from '/imports/api/reasonCodes/collection';
import AccountActions from '/imports/api/taskActions/collection';
import GeneralEnums from '/imports/api/general/enums';
import {StatesSubstates, findStateBySubstate} from '/imports/api/tasks/enums/states.js';
import {Dispatcher, Events} from '/imports/api/events';
import stateEnum from "../../../tasks/enums/states";
import {Substates} from "../../../tasks/enums/substates";

export default class ActionService {

    //Adding action to account
    static createAction(data) {
        const {accountId, actionId, reasonId, userId} = data;
        const action = Actions.findOne({_id: actionId});
        const reason = ReasonCodes.findOne({_id: reasonId});
        const accountActionId = AccountActions.insert({
            userId,
            actionId,
            reasonCode: reason && reason.reason
        });
        Accounts.update({_id: accountId}, {
            $set: {
                hasLastSysAction: false
            },
            $push: {
                actionsLinkData: accountActionId
            }
        });
        Dispatcher.emit(Events.ACCOUNT_ACTION_ADDED, {accountId, action});

        this.changeState(accountId, action.substate);

    }

    static archive(accountIds, facilityId, fileId) {
        _.map(accountIds, (accountId) => {
            const action = {title: "System archive", substate: Substates.SELF_RETURNED, systemAction: true};
            const actionId = Actions.insert(action);
            const accountActionId = AccountActions.insert({
                actionId,
                fileId,
                systemAction: true
            });

            Accounts.update({acctNum: accountId, state: {$ne: stateEnum.ARCHIVED}, facilityId}, {
                    hasLastSysAction: true,
                    $set: {
                        state: stateEnum.ARCHIVED,
                        substate: Substates.SELF_RETURNED,
                        fileId
                    },
                    $push: {
                        actionsLinkData: accountActionId
                    }
                }
            );
        });
    }

    //Change account state if action have a state
    static changeState(accountId, substate) {

        if (substate && substate !== GeneralEnums.NA) {
            state = findStateBySubstate(StatesSubstates, substate);
            Accounts.update({_id: accountId}, {
                $set: {
                    state,
                    substate
                },
                $unset: {
                    tickleDate: null,
                    escalateReason: null
                }
            });
        }
    }
}