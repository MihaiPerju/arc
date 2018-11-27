import Facilities from "/imports/api/facilities/collection";

export default class FacilityService {
  static async getFacilities(filters) {
    const FacilitiesRaw = Facilities.rawCollection();

    FacilitiesRaw.aggregateSync = Meteor.wrapAsync(FacilitiesRaw.aggregate);
    let clients = await FacilitiesRaw.aggregateSync([
      {
        $match: filters
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
          from: "users",
          localField: "allowedUsers",
          foreignField: "_id",
          as: "users"
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "facilityId",
          as: "accounts"
        }
      },
      {
        $lookup: {
          from: "regions",
          localField: "regionId",
          foreignField: "_id",
          as: "region"
        }
      },
      {
        $addFields: {
          client: { $arrayElemAt: ["$client", 0] },
          region: { $arrayElemAt: ["$region", 0] }
        }
      }
    ]).toArray();

    return clients;
  }
}
