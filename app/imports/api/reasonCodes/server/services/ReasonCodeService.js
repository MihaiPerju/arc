import Codes from "/imports/api/reasonCodes/collection";
import RolesEnum from "/imports/api/users/enums/roles";

export default class ReasonCodesService {
  static async getReasonCodes(filters = {}) {
    const CodesRaw = Codes.rawCollection();

    CodesRaw.aggregateSync = Meteor.wrapAsync(CodesRaw.aggregate);
    let codes = await CodesRaw.aggregateSync([
      {
        $match: filters
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
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      {
        $addFields: {
          client: { $arrayElemAt: ["$client", 0] },
          action: { $arrayElemAt: ["$action", 0] }
        }
      }
    ]).toArray();

    return codes;
  }

  static secure(filters = {}) {
    if (Roles.userIsInRole(this.userId, RolesEnum.MANAGER)) {
      _.extend(filters, {
        $or: [{ managerId: this.userId }, { managerId: null }]
      });
    } else if (Roles.userIsInRole(this.userId, RolesEnum.REP)) {
      _.extend(filters, {
        $or: [{ clientId: { $exists: true } }, { managerId: null }]
      });
    } else {
      // for admin and tech
      _.extend(filters, {
        managerId: null
      });
    }
  }
}
