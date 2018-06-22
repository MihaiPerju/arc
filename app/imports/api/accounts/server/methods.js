import ActionService from "./services/ActionService.js";
import Accounts from "../collection";
import AccountSecurity from "./../security";
import Security from "/imports/api/security/security";
import { roleGroups } from "/imports/api/users/enums/roles";
import StateEnum from "/imports/api/accounts/enums/states";
import TimeService from "./services/TimeService";
import moment from "moment";
import Facilities from "/imports/api/facilities/collection";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import fs from "fs";
import os from "os";
import Business from "/imports/api/business";
import Files from "/imports/api/files/collection";
import Backup from "/imports/api/backup/collection";
import AccountActions from "/imports/api/accountActions/collection";
import Actions from "../../actions/collection";
import actionTypesEnum from "../enums/actionTypesEnum";
import EscalationService from "/imports/api/escalations/server/services/EscalationService";

Meteor.methods({
  "account.actions.add"(data) {
    data.userId = this.userId;
    ActionService.createAction(data);
  },

  "account.assignUser"({ _id, assigneeId }) {
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Security.isAllowed(this.userId, roleGroups.ADMIN_TECH_MANAGER);
    Accounts.update(
      { _id },
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
        { _id: accountId },
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
      { _id },
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
        { _id: accountId },
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
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Accounts.update(
      { _id },
      {
        $pull: {
          attachmentIds: attachmentId
        }
      }
    );
    const { path } = Uploads.findOne({ _id: attachmentId });
    Uploads.remove({ _id: attachmentId });
    fs.unlinkSync(Business.LOCAL_STORAGE_FOLDER + "/" + path);
  },

  "account.attachment.update_order"(_id, attachmentIds) {
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Accounts.update(
      { _id },
      {
        $set: {
          attachmentIds
        }
      }
    );
  },

  "account.updateActiveInsCode"(_id, insCode, insName) {
    AccountSecurity.hasRightsOnAccount(this.userId, _id);
    Accounts.update(
      { _id },
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
    for (count in facilities) {
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
        const accounts = Accounts.find({ facilityId: facility._id }).fetch();
        for (index in accounts) {
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
    Accounts.update({ _id }, { $inc: { numberOfViews: 1 } });
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

  "account.tickle"({ tickleDate, _id, tickleUserId }) {
    Accounts.update(
      { _id },
      {
        $set: {
          tickleDate,
          tickleUserId
        }
      }
    );
  },

  "account.escalate"({ reason, accountId }) {
    const escalationId = EscalationService.createEscalation(
      reason,
      this.userId
    );
    Accounts.update(
      { _id: accountId },
      {
        $set: {
          escalationId
        }
      }
    );
  },

  "accounts.getSample"(filters) {
    const AccountsRaw = Accounts.rawCollection();
    AccountsRaw.aggregateSync = Meteor.wrapAsync(AccountsRaw.aggregate);

    return AccountsRaw.aggregateSync([
      { $match: filters },
      { $sample: { size: 20 } }
    ]);
  },

  "account.comment.add"({ content, accountId }) {
    const commentData = {
      userId: this.userId,
      type: actionTypesEnum.COMMENT,
      content,
      createdAt: new Date(),
      accountId
    };
    AccountActions.insert(commentData);
  },

  "account.update"(_id, data) {
    console.log(data);
    Accounts.update(
      { _id },
      {
        $set: data
      }
    );
  },

  //Testing purpose only, delete in production
  reset() {
    Accounts.remove({});
    AccountActions.remove({});
    Files.remove({});
    Backup.remove({});
  }
});
