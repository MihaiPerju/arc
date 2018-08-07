import ActionService from "./services/ActionService.js";
import Accounts from "../collection";
import AccountSecurity from "./../security";
import Security from "/imports/api/security/security";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import StateEnum from "/imports/api/accounts/enums/states";
import TimeService from "./services/TimeService";
import moment from "moment";
import Facilities from "/imports/api/facilities/collection";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import fs from "fs";
import Business from "/imports/api/business";
import EscalationService from "/imports/api/escalations/server/services/EscalationService";
import AccountActions from "/imports/api/accountActions/collection";
import Settings from "/imports/api/settings/collection.js";
import TickleService from "/imports/api/tickles/server/services/TickleService";

Meteor.methods({
  "account.actions.add"(data) {
    data.userId = this.userId;
    ActionService.createAction(data);
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
          workQueue: null
        }
      }
    );
  },
  "account.assignUser.bulk"({ accountIds, assigneeId }) {
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
            workQueue: null
          }
        }
      );
    }
  },
  "account.assignWorkQueue"({ _id, workQueue }) {
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
    Accounts.update(
      {
        _id
      },
      {
        $set: {
          workQueue
        },
        $unset: {
          assigneeId: null
        }
      }
    );
  },
  "account.assignWorkQueue.bulk"({ accountIds, workQueue }) {
    for (let accountId of accountIds) {
      AccountSecurity.hasRightsOnAccount(this.userId, accountId);
      Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
      Accounts.update(
        {
          _id: accountId
        },
        {
          $set: {
            workQueue
          },
          $unset: {
            assigneeId: null
          }
        }
      );
    }
  },

  "account.attachment.remove"(_id, attachmentId, key) {
    const { rootFolder } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });
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
    fs.unlinkSync(rootFolder + Business.ACCOUNTS_FOLDER + path);
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

  "accounts.count"() {
    const result = [];
    const facilities = Facilities.find().fetch();
    for (let count in facilities) {
      let facility = facilities[count];
      //if user has rights on facility or is an admin/tech

      if (
        (facility.allowedUsers &&
          facility.allowedUsers.includes(this.userId)) ||
        Roles.userIsInRole(this.userId, roleGroups.ADMIN_TECH)
      ) {
        const active = Accounts.find({
          state: StateEnum.ACTIVE,
          facilityId: facility._id
        }).count();
        const archived = Accounts.find({
          state: StateEnum.ARCHIVED,
          facilityId: facility._id
        }).count();
        const hold = Accounts.find({
          state: StateEnum.HOLD,
          facilityId: facility._id
        }).count();
        let currentMonth = 0;
        let currentWeek = 0;
        //select accounts this month and week. To be optimized.
        const accounts = Accounts.find({
          facilityId: facility._id
        }).fetch();
        for (let index in accounts) {
          const account = accounts[index];

          if (TimeService.sameMonth(moment(account.createdAt), moment())) {
            currentMonth++;
          }
          if (TimeService.sameWeek(moment(account.createdAt), moment())) {
            currentWeek++;
          }
        }
        result.push({
          name: facility.name,
          active,
          archived,
          hold,
          currentMonth,
          currentWeek
        });
      }
    }
    return result;
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

  "accounts.get"() {
    let result = {
      hold: [],
      active: []
    };

    result.hold = Accounts.find({
      state: StateEnum.HOLD,
      assigneeId: this.userId
    }).count();
    result.active = Accounts.find({
      state: StateEnum.ACTIVE,
      assigneeId: this.userId
    }).count();
    return result;
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
    const AccountsRaw = Accounts.rawCollection();
    AccountsRaw.aggregateSync = Meteor.wrapAsync(AccountsRaw.aggregate);

    return AccountsRaw.aggregateSync([
      {
        $match: filters
      },
      {
        $sample: {
          size: 20
        }
      }
    ]);
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
          userId
        }
      },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
            h: { $hour: "$createdAt" }
          },
          total: { $sum: 1 }
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
  }
});
