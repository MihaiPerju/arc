import SimpleSchema from 'simpl-schema';
import statuses, {StatusList} from '../enums/statuses.js';

export default new SimpleSchema({
    body: {
        type: String,
    },
    taskId: {
        type: String,
    },
    status: {
        type: String,
        allowedValues: StatusList,
        defaultValue: statuses.PENDING,
    },
    createAt: {
        type: Date,
        optional: true,
    },
});