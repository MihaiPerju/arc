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
import NotificationService from "/imports/api/notifications/server/services/NotificationService";
import Users from "/imports/api/users/collection";
import Facilities from "/imports/api/facilities/collection";
import Tickles from "/imports/api/tickles/collection";
import RolesEnum from "/imports/api/users/enums/roles";

export default class ActionService {
  //Freezing account to be processed by the rules engine
  static freezeAccount(_id) {
    Accounts.update(
      { _id },
      {
        $set: {
          isPending: true
        }
      }
    );
  }

  //Adding action to account
  static createAction(data) {
    const { accountId, actionId, reasonCode, userId, addedBy } = data;
    const action = Actions.findOne({
      _id: actionId.value ? actionId.value : actionId
    });
    const { inputs } = action;
    const createdAt = new Date();
    const { value: reasonId } = reasonCode || {};

    const { reason } = reasonId ? ReasonCodes.findOne({ _id: reasonId }) : {};
    const { clientId } = Accounts.findOne({ _id: accountId });
    const accountActionData = {
      userId,
      actionId: actionId.value,
      reasonCode: reasonId && reason,
      addedBy,
      type: actionTypesEnum.USER_ACTION,
      createdAt,
      accountId,
      clientId
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

  //Adding a system action
  static createSystemAction(_id) {
    const { substateId, title, state } = Actions.findOne({ _id });
    console.log(substateId);
    console.log(title);
    console.log(state);
    console.log(this.userId);
    
    // const accountActionData = {
    //   userId,
    //   actionId: actionId.value,
    //   reasonCode: reasonId && reason,
    //   addedBy,
    //   type: actionTypesEnum.USER_ACTION,
    //   createdAt,
    //   accountId,
    //   clientId
    // };

    // const accountActionId = AccountActions.insert(accountActionData);
    // Accounts.update(
    //   { _id: accountId },
    //   {
    //     $set: {
    //       hasLastSysAction: false
    //     },
    //     $push: {
    //       actionsLinkData: accountActionId
    //     }
    //   }
    // );
    // Dispatcher.emit(Events.ACCOUNT_ACTION_ADDED, { accountId, action });

    // this.changeState(accountId, action);

    // const actionsSubState = _.flatten([
    //   StatesSubstates["Archived"],
    //   StatesSubstates["Hold"]
    // ]);
    // const index = _.indexOf(actionsSubState, action.substate);

    // if (index > -1) {
    //   this.removeAssignee(accountId);
    // }
  }

  static archive(accountIds, facilityId, fileId) {
    _.map(accountIds, accountId => {
      const action = {
        title: "System archive",
        substate: Substates.SELF_RETURNED,
        systemAction: true
      };

      const { clientId } = Facilities.findOne({ _id: facilityId });

      const actionId = Actions.insert(action);
      const accountActionId = AccountActions.insert({
        actionId,
        fileId,
        systemAction: true,
        type: actionTypesEnum.SYSTEM_ACTION,
        createdAt: new Date(),
        clientId
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
      // remove previous escalated comments
      Escalations.remove({ _id: escalationId });
    }

    // remove previous tickles history
    Tickles.remove({ accountId });

    // when substateId is present
    if (substateId && substateId !== GeneralEnums.NA) {
      const substate = SubstatesCollection.findOne({ _id: substateId });
      const { name } = substate || {};
      Accounts.update(
        { _id: accountId },
        {
          $set: {
            substate: name
          }
        }
      );
    }

    Accounts.update(
      { _id: accountId },
      {
        $set: {
          state
        },
        $unset: {
          tickleDate: null,
          employeeToRespond: null,
          tickleUserId: null,
          tickleReason: null
        }
      }
    );
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

  static addComment({ content, accountId, isCorrectNote, userId }) {
    const { clientId } = Accounts.findOne({ _id: accountId });
    const commentData = {
      userId,
      type: actionTypesEnum.COMMENT,
      content,
      createdAt: new Date(),
      accountId,
      correctComment: isCorrectNote,
      clientId
    };
    const accountActionId = AccountActions.insert(commentData);
    Accounts.update(
      { _id: accountId },
      {
        $push: {
          commentIds: accountActionId
        }
      }
    );
    if (isCorrectNote) {
      this.sendNotification(accountId);
    }
  }

  static sendNotification(accountId) {
    const { assigneeId, workQueue } = Accounts.findOne({ _id: accountId });

    if (assigneeId && Roles.userIsInRole(assigneeId, RolesEnum.REP)) {
      NotificationService.createGlobal(assigneeId);
      NotificationService.createCommentNotification(assigneeId, accountId);
    } else if (workQueue) {
      const users = Users.find({ tagIds: workQueue }).fetch();
      for (let user of users) {
        const { _id } = user;
        NotificationService.createGlobal(_id);
        NotificationService.createCommentNotification(_id, accountId);
      }
    }
  }

  static graphStandardizeData(actionsPerHour) {
    const graphData = [];

    for (let i = 0; i < 24; i++) {
      let data = [];
      data.push(i, 0);
      graphData.push(data);
    }

    actionsPerHour.map(actionPerHour => {
      graphData.find((data, index) => {
        if (data[0] === actionPerHour._id.h) {
          graphData[index] = [actionPerHour._id.h, actionPerHour.total];
        }
      });
    });
    return graphData;
  }

  static updateAccount(_id, data, userId) {
    const key = Object.keys(data)[0];
    const account = Accounts.findOne({ _id });
    if (key) {
      const editData = {
        clientId: account["clientId"],
        createdAt: new Date(),
        userId,
        accountField: key,
        fieldPreviousValue: account[key],
        fieldUpdatedValue: data[key],
        type: actionTypesEnum.EDIT,
        accountId: _id
      };

      AccountActions.insert(editData);
      Accounts.update(
        { _id },
        {
          $set: data
        }
      );
    }
  }

  static addLockToAccount(_id, userId) {
    // remove previous lock from the account by logged-in user
    const account = Accounts.findOne({ lockOwnerId: userId });

    if (account) {
      this.removeLockFromAccount(account._id, userId);
    }

    Accounts.update(
      {
        _id,
        lockOwnerId: null
      },
      {
        $set: {
          lockOwnerId: userId,
          lockTimestamp: new Date()
        }
      }
    );
  }

  static removeLockFromAccount(userId) {
    Accounts.update(
      {
        lockOwnerId: userId
      },
      {
        $set: {
          lockOwnerId: null,
          lockTimestamp: null,
          lockBreakUsers: []
        }
      }
    );
  }

  static breakLockFromAccount(_id, userId) {
    const { clientId } = Accounts.findOne({ _id });
    const data = {
      userId,
      type: actionTypesEnum.LOCK_BREAK,
      createdAt: new Date(),
      accountId: _id,
      clientId
    };

    AccountActions.insert(data);
    Accounts.update(
      {
        _id
      },
      {
        $push: {
          lockBreakUsers: userId
        }
      }
    );
  }
}
