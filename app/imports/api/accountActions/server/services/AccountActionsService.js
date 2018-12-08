import AccountActions from "../../collection";

export default class AccountActionsService {
  static async getActions(params) {
    let AccountActionsRaw = AccountActions.rawCollection();

    AccountActionsRaw.aggregateSync = Meteor.wrapAsync(
      AccountActionsRaw.aggregate
    );
    let actions = await AccountActionsRaw.aggregateSync([
      {
        $match: params
      },
      {
        $lookup: {
          from: "actions",
          localField: "actionId",
          foreignField: "_id",
          as: "action"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "letter_templates",
          localField: "letterTemplateId",
          foreignField: "_id",
          as: "letterTemplate"
        }
      },
      {
        $lookup: {
          from: "account_actions",
          localField: "flagActionId",
          foreignField: "_id",
          as: "flagAction"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "managerId",
          foreignField: "_id",
          as: "manager"
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "account"
        }
      },
      {
        $addFields: {
          action: { $arrayElemAt: ["$action", 0] },
          user: { $arrayElemAt: ["$user", 0] },
          letterTemplate: { $arrayElemAt: ["$letterTemplate", 0] },
          flagAction: { $arrayElemAt: ["$flagAction", 0] },
          manager: { $arrayElemAt: ["$manager", 0] },
          account: { $arrayElemAt: ["$account", 0] }
        }
      }
    ]).toArray();

    return actions;
  }
}
