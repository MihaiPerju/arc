import Escalations from "/imports/api/escalations/collection";

export default class EscalationService {
  static createEscalation(content, authorId, accountId) {
    const escalation = {
      authorId,
      accountId,
      messages: [{ content }]
    };
    return Escalations.insert(escalation);
  }
}
