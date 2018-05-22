const States = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
  HOLD: "Hold",
  ESCALATED: "Escalated"
};

import { LabelSubstates, Substates } from "./substates";

export const StatesSubstates = {
  [States.HOLD]: [
    Substates.PENDING_PAYMENT,
    Substates.AWAITING_PAYMENT,
    Substates.TOO_SOON_FOR_FOLLOW_UP,
    Substates.BILLED,
    Substates.APPEALED,
    Substates.HOSPITAL_REVIEW
  ],
  [States.ARCHIVED]: [
    Substates.SUCCESSFUL_COLLECTION,
    Substates.FAIL,
    Substates.PAID,
    Substates.REPORTED,
    Substates.SELF_RETURNED,
    Substates.MERGED,
    Substates.UNKNOWN
  ],
  [States.ACTIVE]: [
    Substates.NEW,
    Substates.FOLLOW_UP,
    Substates.DENIED,
    Substates.RETURNED,
    Substates.BILLABLE,
    Substates.SELF_PAY
  ],
  [States.ESCALATED]: [Substates.ESCALATED]
};

export function findStateBySubstate(statesWithSubstates, substate) {
  for (key in statesWithSubstates) {
    if (_.contains(statesWithSubstates[key], substate)) {
      return key;
    }
  }
}

const StateList = [
  States.HOLD,
  States.ARCHIVED,
  States.ACTIVE,
  States.ESCALATED
];

export { StateList };

export default States;
