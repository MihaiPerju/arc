import Users from "/imports/api/users/collection";

export default class UserService {
  static async getUsers(filters = {}) {
    const UsersRaw = Users.rawCollection();

    UsersRaw.aggregateSync = Meteor.wrapAsync(UsersRaw.aggregate);
    let users = await UsersRaw.aggregateSync([
      {
        $match: filters
      },
      {
        $lookup: {
          from: "workQueues",
          localField: "workQueueIds",
          foreignField: "_id",
          as: "workQueues"
        }
      }
    ]).toArray();

    return users;
  }

  static async getUser(filters = {}) {
    const UsersRaw = Users.rawCollection();

    UsersRaw.aggregateSync = Meteor.wrapAsync(UsersRaw.aggregate);
    let users = await UsersRaw.aggregateSync([
      {
        $match: filters
      },
      {
        $lookup: {
          from: "workQueues",
          localField: "workQueueIds",
          foreignField: "_id",
          as: "workQueues"
        }
      },
      {
        $limit: 1
      }
    ]).toArray();

    return users[0];
  }
}
