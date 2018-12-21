import Accounts from "../../collection";

export default class AccountsService {
  static async getAccount(_id) {
    const AccountsRaw = Accounts.rawCollection();

    AccountsRaw.aggregateSync = Meteor.wrapAsync(AccountsRaw.aggregate);
    let accounts = await AccountsRaw.aggregateSync([
      {
        $match: { _id }
      },
      {
        $lookup: {
          from: "users",
          localField: "assigneeId",
          foreignField: "_id",
          as: "assignee"
        }
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      {
        $lookup: {
          from: "facilities",
          localField: "facilityId",
          foreignField: "_id",
          as: "facility"
        }
      },
      {
        $lookup: {
          from: "uploads",
          localField: "attachmentIds",
          foreignField: "_id",
          as: "attachments"
        }
      },
      {
        $lookup: {
          from: "account_actions",
          localField: "actionIds",
          foreignField: "_id",
          as: "actions"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "actions.userId",
          foreignField: "_id",
          as: "action_users"
        }
      },
      {
        $lookup: {
          from: "actions",
          localField: "actions.actionId",
          foreignField: "_id",
          as: "action_list"
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "workQueueId",
          foreignField: "_id",
          as: "tag"
        }
      },
      {
        $lookup: {
          from: "account_actions",
          localField: "flagIds",
          foreignField: "_id",
          as: "flags"
        }
      },
      {
        $lookup: {
          from: "account_actions",
          localField: "commentIds",
          foreignField: "_id",
          as: "comments"
        }
      },
      {
        $lookup: {
          from: "letters",
          localField: "letterIds",
          foreignField: "_id",
          as: "letters"
        }
      },
      {
        $addFields: {
          assignee: { $arrayElemAt: ["$assignee", 0] },
          client: { $arrayElemAt: ["$client", 0] },
          facility: { $arrayElemAt: ["$facility", 0] },
          tag: { $arrayElemAt: ["$tag", 0] }
        }
      },
      { $limit: 1 }
    ]).toArray();

    return accounts[0];
  }

  static async getSample(filters = {}) {
    const AccountsRaw = Accounts.rawCollection();

    AccountsRaw.aggregateSync = Meteor.wrapAsync(AccountsRaw.aggregate);
    let accounts = await AccountsRaw.aggregateSync([
      {
        $match: filters
      },
      {
        $sample: { size: 20 }
      }
    ]).toArray();

    return accounts;
  }

  static applyProjection(options) {
    _.extend(options, {
      fields: {
        acctBal: 1,
        acctNum: 1,
        createdAt: 1,
        tagIds: 1,
        substate: 1,
        ptName: 1,
        lockOwner: 1,
        lockOwnerId: 1,
        lockTimestamp: 1,
        tickleDate: 1,
        facilityId: 1
      }
    });
  }
}
