import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    reportId: {
        type: String
    },
    frequency: {
        type: Array
    },
    'frequency.$': {
        type: String
    },
    userIds: {
        type: Array
    },
    'userIds.$': {
        type: String
    },
    clientIds: {
        type: Array
    },
    'clientIds.$': {
        type: String
    }
});