const States = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    HOLD: 'Hold'
}

import {LabelSubstates, Substates} from './substates';

export const StatesSubstates = {
    [States.HOLD]: [
        LabelSubstates[Substates.PENDING_PAYMENT], 
        LabelSubstates[Substates.AWAITING_PAYMENT], 
        LabelSubstates[Substates.TOO_SOON_FOR_FOLLOW_UP],
        LabelSubstates[Substates.BILLED], 
        LabelSubstates[Substates.APPEALED], 
        LabelSubstates[Substates.HOSPITAL_REVIEW]
    ],
    [States.ARCHIVED]: [
        LabelSubstates[Substates.SUCCESSFUL_COLLECTION], 
        LabelSubstates[Substates.FAIL], 
        LabelSubstates[Substates.PAID], 
        LabelSubstates[Substates.REPORTED],
        LabelSubstates[Substates.SELF_RETURNED], 
        LabelSubstates[Substates.MERGED], 
        LabelSubstates[Substates.UNKNOWN]
    ],
    [States.ACTIVE]: [
        LabelSubstates[Substates.NEW], 
        LabelSubstates[Substates.FOLLOW_UP], 
        LabelSubstates[Substates.DENIED], 
        LabelSubstates[Substates.RETURNED],
        LabelSubstates[Substates.BILLABLE], 
        LabelSubstates[Substates.SELF_PAY], 
        LabelSubstates[Substates.ESCALATED]
    ]
}

export function findStateBySubstate(statesWithSubstates, substate) {
    for (key in statesWithSubstates) {
        if (_.contains(statesWithSubstates[key], substate)) {
            return key;
        }
    }
}

export default States;
