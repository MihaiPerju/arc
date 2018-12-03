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
          from: "tags",
          localField: "tagIds",
          foreignField: "_id",
          as: "tags"
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
          from: "tags",
          localField: "tagIds",
          foreignField: "_id",
          as: "tags"
        }
      },
      {
        $limit: 1
      }
    ]).toArray();

    return users[0];
  }
}
