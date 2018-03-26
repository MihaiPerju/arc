import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    userId: {
        type: String,
        optional: true
    },
    actionId: {
        type: String
    },
    reasonCode: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        defaultValue: new Date
    },
    systemAction: {
        type: Boolean,
        defaultValue: false
    },
    fileId: {
        type: String,
        optional: true
    }
});