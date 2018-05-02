import Actions from '/imports/api/actions/collection';
import ReasonCodes from './collection';

ReasonCodes.addLinks({
    action: {
        collection: Actions,
        type: 'one',
        field: 'actionId'
    }
});