import Codes from "/imports/api/reasonCodes/collection";

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
}
