import Escalations from "/imports/api/escalations/collection";

export default class EscalationService {
  static createEscalation(content,authorId) {
    const escalation = {
      authorId,
      messages: [{ content }]
    };
    return Escalations.insert(escalation);
  }
}
