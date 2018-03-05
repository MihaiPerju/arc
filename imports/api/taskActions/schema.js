import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    userId: {
        type: String
    },
    actionId: {
        type: String
    },
    reasonCode: {
        type: String
    },
    createdAt: {
        type: Date,
        optional: true
    }
});