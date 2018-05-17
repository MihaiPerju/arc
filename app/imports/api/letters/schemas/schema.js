import SimpleSchema from 'simpl-schema';
import statuses, {StatusList} from '../enums/statuses.js';

export default new SimpleSchema({
    body: {
        type: String,
    },
    accountId: {
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
    attachmentIds: {
        type: Array,
        optional: true
    },
    'attachmentIds.$': {
        type: String,
    },
    letterTemplateId: {
        type: String,
        optional: true,
    },
    letterValues: {
        type: Object,
        optional: true,
        blackbox: true
    }
});