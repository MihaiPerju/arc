import SimpleSchema from 'simpl-schema';
import { StateList } from '/imports/api/accounts/enums/states';

export default new SimpleSchema({
    name: {
        type: String,
    },
    stateName: {
        type: String,
        allowedValues: StateList
    }
});