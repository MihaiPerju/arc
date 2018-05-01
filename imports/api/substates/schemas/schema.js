import SimpleSchema from 'simpl-schema';
import { StateList } from '/imports/api/tasks/enums/states';

export default new SimpleSchema({
    name: {
        type: String,
    },
    stateName: {
        type: String,
        allowedValues: StateList
    }
});