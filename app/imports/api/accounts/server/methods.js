import ActionService from "./services/ActionService.js";
import Accounts from "../collection";
import AccountSecurity from "./../security";
import Security from "/imports/api/security/security";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import moment from "moment";
import Facilities from "/imports/api/facilities/collection";
import Uploads from "/imports/api/uploads/uploads/collection";
import fs from "fs";
import Business from "/imports/api/business";
import EscalationService from "/imports/api/escalations/server/services/EscalationService";
import AccountActions from "/imports/api/accountActions/collection";
import TickleService from "/imports/api/tickles/server/services/TickleService";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";
import Users from "/imports/api/users/collection";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import AccountsService from "/imports/api/accounts/server/services/AccountsService";

Meteor.methods({
  "accounts.get"(params) {
    let userId = this.userId;
    const queryParams = QueryBuilder.getAccountParams(params, userId);
    let filters = queryParams.filters;
    let options = queryParams.options;
    AccountsService.applyProjection(options);
    return Accounts.find(filters, options).fetch();
  },

  "account.getMetadata"(_id) {
    const account = Accounts.findOne({ _id });
    return account.metadata;
  },

  "account.freeze"(_id) {
    ActionService.freezeAccount(_id);
  },

  "account.addAction"(data) {
    data.userId = this.userId;
    ActionService.createAction(data);
  },

  "account.getOne"(_id) {
    return AccountsService.getAccount(_id);
  },

  "account.assignUser"({ _id, assigneeId }) {
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
    Accounts.update(
      {
        _id
      },
      {
        $set: {
          assigneeId
        },
        $unset: {
          workQueueId: null
        }
      }
    );
  },

  "account.assignUser.bulk"({ accountIds, assigneeId, params }) {
    if (params) {
      accountIds = [];
      let accountIdList = Accounts.find(params).fetch();
      _.map(accountIdList, account => {
        accountIds.push(account._id);
      });
    }

    for (let accountId of accountIds) {
      AccountSecurity.hasRightsOnAccount(this.userId, accountId);
      Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
      Accounts.update(
        {
          _id: accountId
        },
        {
          $set: {
            assigneeId
          },
          $unset: {
            workQueueId: null
          }
        }
      );
    }
  },
  "account.assignWorkQueue"({ _id, workQueueId }) {
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
    Accounts.update(
      {
        _id
      },
      {
        $set: {
          workQueueId
        },
        $unset: {
          assigneeId: null
        }
      }
    );
  },
  "account.assignWorkQueue.bulk"({ accountIds, workQueueId, params }) {
    if (params) {
      accountIds = [];
      let accountIdList = Accounts.find(params).fetch();
      _.map(accountIdList, account => {
        accountIds.push(account._id);
      });
    }

    for (let accountId of accountIds) {
      AccountSecurity.hasRightsOnAccount(this.userId, accountId);
      Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
      Accounts.update(
        {
          _id: accountId
        },
        {
          $set: {
            workQueueId
          },
          $unset: {
            assigneeId: null
          }
        }
      );
    }
  },

  "account.attachment.remove"(_id, attachmentId) {
    const { root } = SettingsService.getSettings(settings.ROOT);

    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Accounts.update(
      {
        _id
      },
      {
        $pull: {
          attachmentIds: attachmentId
        }
      }
    );
    const { path } = Uploads.findOne({
      _id: attachmentId
    });
    Uploads.remove({
      _id: attachmentId
    });
    const filePath = root + Business.ACCOUNTS_FOLDER + _id + "/" + path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },

  "account.updateActiveInsCode"(_id, insCode, insName) {
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Accounts.update(
      {
        _id
      },
      {
        $set: {
          activeInsCode: insCode,
          activeInsName: insName
        }
      }
    );
  },

  "accounts.count"(params) {
    let userId = this.userId;
    const queryParams = QueryBuilder.getAccountParams(params, userId);
    let filters = queryParams.filters;
    return Accounts.find(filters).count();
  },

  "accounts.increment_view_count"(_id) {
    Accounts.update(
      {
        _id
      },
      {
        $inc: {
          numberOfViews: 1
        }
      }
    );
  },

  "account.tickle"({ tickleDate, _id, tickleUserId, tickleReason }) {
    TickleService.addMessage({
      tickleDate,
      _id,
      tickleUserId,
      tickleReason
    });
    Accounts.update(
      {
        _id
      },
      {
        $set: {
          tickleDate,
          tickleUserId,
          tickleReason
        },
        $unset: {
          employeeToRespond: null
        }
      }
    );
  },

  "account.escalate"({ reason, accountId }) {
    const escalationId = EscalationService.createEscalation(
      reason,
      this.userId,
      accountId
    );
    Accounts.update(
      {
        _id: accountId
      },
      {
        $set: {
          employeeToRespond: RolesEnum.MANAGER,
          escalationId
        },
        $unset: {
          tickleDate: null,
          tickleUserId: null,
          tickleReason: null
        }
      }
    );
  },

  "accounts.getSample"(filters) {
    return AccountsService.getSample(filters);
  },

  "account.comment.add"(data) {
    data.userId = this.userId;
    ActionService.addComment(data);
  },

  "account.update"(_id, data) {
    ActionService.updateAccount(_id, data, this.userId);
  },

  "account.tag"({ _id, tagIds }) {
    Accounts.update(
      {
        _id
      },
      {
        $set: {
          tagIds
        }
      }
    );
  },

  async "account.getActionPerHour"(userId, date) {
    const AccountsRaw = AccountActions.rawCollection();
    AccountsRaw.aggregateSync = Meteor.wrapAsync(AccountsRaw.aggregate);

    const actionsPerHour = await AccountsRaw.aggregateSync([
      {
        $match: {
          createdAt: {
            $gte: new Date(moment(date).startOf("day")),
            $lt: new Date(
              moment(date)
                .add(1, "day")
                .startOf("day")
            )
          },
          userId,
          type: actionTypesEnum.USER_ACTION
        }
      },
      {
        $group: {
          _id: {
            y: {
              $year: "$createdAt"
            },
            m: {
              $month: "$createdAt"
            },
            d: {
              $dayOfMonth: "$createdAt"
            },
            h: {
              $hour: "$createdAt"
            }
          },
          total: {
            $sum: 1
          }
        }
      }
    ]).toArray();

    return ActionService.graphStandardizeData(actionsPerHour);
  },

  "account.addLock"(_id) {
    ActionService.addLockToAccount(_id, this.userId);
  },

  "account.removeLock"() {
    ActionService.removeLockFromAccount(this.userId);
  },

  "account.breakLock"(_id) {
    ActionService.breakLockFromAccount(_id, this.userId);
  },

  "account.restartLockTimer"(_id) {
    Accounts.update(
      {
        _id,
        lockOwnerId: this.userId
      },
      {
        $set: {
          lockTimestamp: new Date()
        }
      }
    );
  },

  "account.facility"(params) {
    let accounts = Accounts.find(params).fetch();
    let facilityList = [];
    let facilityObj = [];
    _.map(accounts, account => {
      if (!facilityList.includes(account.facilityId)) {
        facilityList.push(account.facilityId);
      }
    });

    if (facilityList.length > 0) {
      _.map(facilityList, facilityId => {
        let facilityDetails = Facilities.find({ _id: facilityId }).fetch()[0];
        let res = {
          label: facilityDetails.name,
          value: facilityDetails._id
        };
        facilityObj.push(res);
      });
      return facilityObj;
    }
  },

  "account.facility.user"(facilityId) {
    let facilityDetails = Facilities.find({ _id: facilityId }).fetch()[0];
    if (facilityDetails && facilityDetails.allowedUsers) {
      let usersId = facilityDetails.allowedUsers;
      let userOption = [];
      _.map(usersId, user => {
        let userDetail = Users.find({ _id: user }).fetch()[0];
        let res = {
          label:
            userDetail.profile.firstName +
            " " +
            userDetail.profile.lastName +
            "(" +
            userDetail.roles[0] +
            ")",
          value: user
        };
        userOption.push(res);
      });
      return userOption;
    }
  },

  "account.assignAction.bulk"(
    data,
    selectedActionId,
    reasonCodes,
    params,
    accounts
  ) {
    let accountIdList = [];
    if (accounts) {
      accountIdList = Accounts.find({ _id: { $in: accounts } }).fetch();
    } else {
      accountIdList = Accounts.find(params).fetch();
    }

    _.map(accountIdList, account => {
      selectedActionId ? (data.actionId = selectedActionId) : null;
      reasonCodes.length > 0 ? (data.reasonCode = reasonCodes) : null;

      data.userId = this.userId;
      data.accountId = account._id;

      if (account.assignee) {
        data.addedBy = `${account.assignee.profile.firstName} ${
          account.assignee.profile.lastName
        }`;
      } else if (account.workQueueId) {
        data.addedBy = account.tag.name;
      }

      ActionService.createAction(data);
    });
  }
});
