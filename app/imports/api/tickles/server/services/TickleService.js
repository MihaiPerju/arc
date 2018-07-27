import Tickles from "/imports/api/tickles/collection";
import Users from "/imports/api/users/collection";

export default class TickleService {
  static addMessage({ tickleDate, _id, tickleUserId, tickleReason }) {
    const { profile } = Users.findOne({ _id: tickleUserId });
    const userName = `${profile.firstName} ${profile.lastName}`;
    const message = {
      reason: tickleReason,
      userName,
      tickleDate,
      createdAt: new Date()
    };

    return Tickles.update(
      { accountId: _id },
      {
        $push: {
          messages: message
        }
      },
      {
        upsert: true
      }
    );
  }
}
