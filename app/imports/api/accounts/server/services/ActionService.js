import _ from "underscore";
import Actions from "/imports/api/actions/collection";
import ReasonCodes from "/imports/api/reasonCodes/collection";
import AccountActions from "/imports/api/accountActions/collection";
import GeneralEnums from "/imports/api/general/enums";
import {
  StatesSubstates
} from "/imports/api/accounts/enums/states.js";
import {
  Dispatcher,
  Events
} from "/imports/api/events";
import stateEnum from "../../enums/states";
import {
  Substates
} from "../../enums/substates";
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
    Accounts.update({
      _id
    }, {
        $set: {
          isPending: true
        },
        $unset: {
          workQueueId: null,
          assigneeId: null,
          escalationId: null
        }
      });
  }

  //Adding action to account
  static createAction(data) {
    const {
      accountId,
      actionId,
      reasonCode,
      userId,
      addedBy
    } = data;
    const action = Actions.findOne({
      _id: actionId.value ? actionId.value : actionId
    });
    const {
      inputs
    } = action;
    const createdAt = new Date();
    const {
      value: reasonId
    } = reasonCode || {};

    let reason;
    if (reasonId) {
      reason = reasonId ? ReasonCodes.findOne({
        _id: reasonId
      }).reason : {};
    } else {
      // if the reasonId is not availble on the above destructing.  
      reason = reasonCode ? ReasonCodes.findOne({
        _id: reasonCode
      }).reason : {};
    }

    const {
      clientId
    } = Accounts.findOne({
      _id: accountId
    });
    const accountActionData = {
      userId,
      actionId: actionId.value ? actionId.value : actionId,
      reasonCode: reason && reason,
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
    Accounts.update({
      _id: accountId
    }, {
        $set: {
          hasLastSysAction: false,
          lastUserAction: action._id
        },
        $unset: {
          escalationId: null
        },
        $push: {
          actionIds: accountActionId
        }
      });

    Dispatcher.emit(Events.ACCOUNT_ACTION_ADDED, {
      accountId,
      action
    });

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
  static createSystemAction(_id, accountId) {
    const {
      clientId
    } = Accounts.findOne({
      _id: accountId
    });
    const action = Actions.findOne({
      _id
    });

    const accountAction = {
      actionId: _id,
      type: actionTypesEnum.SYSTEM_ACTION,
      createdAt: new Date(),
      accountId,
      clientId
    };

    const accountActionId = AccountActions.insert(accountAction);
    Accounts.update({
      _id: accountId
    }, {
        $set: {
          hasLastSysAction: true
        },
        $push: {
          actionIds: accountActionId
        }
      });
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
      const {
        clientId
      } = Facilities.findOne({
        _id: facilityId
      });

      const accountActionId = AccountActions.insert({
        fileId,
        systemAction: true,
        type: actionTypesEnum.SYSTEM_ACTION,
        createdAt: new Date(),
        clientId
      });

      Accounts.update({
        acctNum: accountId,
        state: {
          $ne: stateEnum.ARCHIVED
        },
        facilityId
      }, {
          hasLastSysAction: true,
          $set: {
            state: stateEnum.ARCHIVED,
            substate: Substates.SELF_RETURNED,
            fileId
          },
          $push: {
            actionIds: accountActionId
          }
        });
    });
  }

  //Change account state if action has a state
  static changeState(accountId, {
    state,
    substateId
  }) {
    const {
      escalationId
    } = Accounts.findOne({
      _id: accountId
    }) || null;
    if (escalationId) {
      // remove previous escalated comments
      Escalations.remove({
        _id: escalationId
      });
    }

    let prevState = Accounts.findOne({
      _id: accountId
    }).state || null;
    let reactivationDate = (prevState && prevState === stateEnum.ARCHIVED) ? new Date() : null;

    // remove previous tickles history
    Tickles.remove({
      accountId
    });

    // when substateId is present
    if (substateId && substateId !== GeneralEnums.NA) {
      const substate = SubstatesCollection.findOne({
        _id: substateId
      });
      const {
        name
      } = substate || {};
      Accounts.update({
        _id: accountId
      }, {
          $set: {
            substate: name
          }
        });
    }

    Accounts.update({
      _id: accountId
    }, {
        $set: {
          state,
          reactivationDate
        },
        $unset: {
          tickleDate: null,
          employeeToRespond: null,
          tickleUserId: null,
          tickleReason: null
        }
      });
  }

  static removeAssignee(_id) {
    Accounts.update({
      _id
    }, {
        $unset: {
          workQueueId: null,
          assigneeId: null
        }
      });
  }

  static addComment({
    content,
    accountId,
    isCorrectNote,
    userId
  }) {
    const {
      clientId
    } = Accounts.findOne({
      _id: accountId
    });
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
    Accounts.update({
      _id: accountId
    }, {
        $push: {
          commentIds: accountActionId
        }
      });
    if (isCorrectNote) {
      this.sendNotification(accountId);
    }
  }

  static sendNotification(accountId) {
    const {
      assigneeId,
      workQueueId
    } = Accounts.findOne({
      _id: accountId
    });

    if (assigneeId && Roles.userIsInRole(assigneeId, RolesEnum.REP)) {
      NotificationService.createGlobal(assigneeId);
      NotificationService.createCommentNotification(assigneeId, accountId);
    } else if (workQueueId) {
      const users = Users.find({
        tagIds: workQueueId
      }).fetch();
      for (let user of users) {
        const {
          _id
        } = user;
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
    const account = Accounts.findOne({
      _id
    });
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
      Accounts.update({
        _id
      }, {
          $set: data
        });
    }
  }

  static addLockToAccount(_id, userId, lockOwner) {
    Accounts.update(
      {
        _id
      },
      {
        $set: {
          lockOwner,
          lockOwnerId: userId,
          lockTimestamp: new Date()
        }
      }
    );
  }

  // This is bad code and should be fixed!
  static removeLockFromAccount(userId) {
    Accounts.update({
      lockOwnerId: userId
    }, {
      $set: {
        lockOwner: null,
        lockOwnerId: null,
        lockTimestamp: null
      }
    });
  }

  static breakLockFromAccount(_id, userId) {
    const account = Accounts.findOne({_id});

    const data = {
      userId,
      type: actionTypesEnum.LOCK_BREAK,
      createdAt: new Date(),
      accountId: _id,
      clientId: account.clientId
    };

    AccountActions.insert(data);
    
    // Not needed right now, maybe use in future to show who is viewing acct w/ you
    // Accounts.update({
    //   _id
    // }, {
    //   $push: {
    //     lockBreakUsers: userId
    //   }
    // });
  }
}