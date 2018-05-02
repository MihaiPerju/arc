import TaskActions from './collection';
import Actions from '/imports/api/actions/collection';

TaskActions.addLinks({
    action: {
        type: 'one',
        collection: Actions,
        field: 'actionId'
    }
});