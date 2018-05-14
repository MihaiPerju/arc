import AccountActions from './collection';
import Actions from '/imports/api/actions/collection';

AccountActions.addLinks({
    action: {
        type: 'one',
        collection: Actions,
        field: 'actionId'
    }
});