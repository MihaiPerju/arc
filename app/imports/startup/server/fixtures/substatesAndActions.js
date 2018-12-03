import Substates from '/imports/api/substates/collection';
import Actions from '/imports/api/actions/collection';
import ReasonCodes from '/imports/api/reasonCodes/collection';
import ActionService from '/imports/api/actions/server/services/ActionService';
import seeds from './seeds/actions';

Meteor.startup(() => {
    // Verify no other substates or actions exist, we don't want to cause duplicates
    if (Substates.find().count() > 0 || Actions.find().count() > 0)
        return true;

    // Let user know we are addind seed data
    console.log('No substates or actions, adding default seed data...');

    Object.keys(seeds).forEach(key => {
        seeds[key].forEach(substate => {

            // Insert the substate
            const substateId = Substates.insert({
                stateName: key,
                status: true,
                name: substate.name,
                tagIds: []
            })

            // Insert the new action
            substate.actions.forEach(action => {
                const actionId = ActionService.createAction({
                    title: action.name,
                    substateId,
                    state: key,
                    systemAction: action.systemAction || false,
                    description: action.description || '',
                    inputs: action.inputs || [],
                    tagIds: []
                })

                // Insert all the reason codes
                action.reasons.forEach(reason => {
                    ReasonCodes.insert({
                        reason,
                        actionId
                    })
                })
            })
        })
    })
});