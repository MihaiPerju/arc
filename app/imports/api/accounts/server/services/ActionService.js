import _ from "underscore";
import Actions from "/imports/api/actions/collection";
import ReasonCodes from "/imports/api/reasonCodes/collection";
import AccountActions from "/imports/api/accountActions/collection";
import GeneralEnums from "/imports/api/general/enums";
import { StatesSubstates } from "/imports/api/accounts/enums/states.js";
import { Dispatcher, Events } from "/imports/api/events";
import stateEnum from "../../enums/states";
import { Substates } from "../../enums/substates";
import Accounts from "../../collection";
import SubstatesCollection from "/imports/api/substates/collection";
import actionTypesEnum from "../../enums/actionTypesEnum";
import Escalations from "/imports/api/escalations/collection";

export default class ActionService {
  //Adding action to account
  static createAction(data) {
    const { accountId, actionId, reasonCode: reasonId, userId, addedBy } = data;
    const action = Actions.findOne({
      _id: actionId.value ? actionId.value : actionId
    });
    const { inputs } = action;
    const createdAt = new Date();
    const { reason } = reasonId ? ReasonCodes.findOne({ _id: reasonId }) : {};
    const accountActionData = {
      userId,
      actionId: actionId.value,
      reasonCode: reasonId && reason,
      addedBy,
      type: actionTypesEnum.USER_ACTION,
      createdAt
    };
    const customFields = {};
    _.map(inputs, input => {
      customFields[input.label] = data[input.label];
    });

    if (!_.isEmpty(customFields)) {
      accountActionData.customFields = customFields;
    }

    const accountActionId = AccountActions.insert(accountActionData);
    Accounts.update(
      { _id: accountId },
      {
        $set: {
          hasLastSysAction: false
        },
        $push: {
          actionsLinkData: accountActionId
        }
      }
    );
    Dispatcher.emit(Events.ACCOUNT_ACTION_ADDED, { accountId, action });

    this.changeState(accountId, action);

    const actionsSubState = _.flatten([
      StatesSubstates["Archived"],
      StatesSubstates["Hold"]
    ]);
    const index = _.indexOf(actionsSubState, action.substate);

    if (index > -1) {
      this.removeAssignee(accountId);
    }
  }

  static archive(accountIds, facilityId, fileId) {
    _.map(accountIds, accountId => {
      const action = {
        title: "System archive",
        substate: Substates.SELF_RETURNED,
        systemAction: true
      };
      const actionId = Actions.insert(action);
      const accountActionId = AccountActions.insert({
        actionId,
        fileId,
        systemAction: true,
        type: actionTypesEnum.SYSTEM_ACTION,
        createdAt: new Date()
      });

      Accounts.update(
        { acctNum: accountId, state: { $ne: stateEnum.ARCHIVED }, facilityId },
        {
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

  //Change account state if action has a state
  static changeState(accountId, { state, substateId }) {
    const { escalationId } = Accounts.findOne({ _id: accountId }) || null;
    if (escalationId) {
      Escalations.remove({ _id: escalationId });
      
    }
    if (substateId && substateId !== GeneralEnums.NA) {
      const substate = SubstatesCollection.findOne({ _id: substateId });
      const { name } = substate || {};
      Accounts.update(
        { _id: accountId },
        {
          $set: {
            state,
            substate: name
          },
          $unset: {
            tickleDate: null,
            escalationId: null
          }
        }
      );
    }
  }

  static removeAssignee(_id) {
    Accounts.update(
      { _id },
      {
        $unset: {
          workQueue: null,
          assigneeId: null
        }
      }
    );
  }
}
