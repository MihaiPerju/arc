import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    userId: {
        type: String,
        optional: true
    },
    actionId: {
        type: String,
        optional: true
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
    },
    addedBy: {
        type: String,
        optional: true
    },
    customFields: {
        type: Object,
        optional: true,
        blackbox: true
    },
    type: {
        type: String
    },
    content: {
        type: String,
        optional: true
    },
    accountId: {
        type: String,
        optional: true
    },
    letterTemplateId: {
        type: String,
        optional: true
    },
    fileName: {
        type: String,
        optional: true
    }
});