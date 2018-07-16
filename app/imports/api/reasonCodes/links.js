import Actions from '/imports/api/actions/collection';
import Clients from '/imports/api/clients/collection';
import ReasonCodes from './collection';

ReasonCodes.addLinks({
    action: {
        collection: Actions,
        type: 'one',
        field: 'actionId'
    },
    client: {
        collection: Clients,
        type: 'one',
        field: 'clientId'
    }
});