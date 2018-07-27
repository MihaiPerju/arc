import Escalations from "/imports/api/escalations/collection";
import Users from "/imports/api/users/collection";

export default class EscalationService {
  static createEscalation(content, authorId, accountId) {
    const {profile} = Users.findOne({_id:authorId})
    const userName = `${profile.firstName} ${profile.lastName}`
    const createdAt = new Date();
    const escalation = {
      authorId,
      accountId,
      messages: [{ content, userName, createdAt }]
    };
    return Escalations.insert(escalation);
  }
}
