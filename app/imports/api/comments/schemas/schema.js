import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    content: {
        type: String
    },
    authorId: {
        type: String
    },
    accountId: {
        type: String
    },
    createdAt: {
        type: Date,
        defaultValue: new Date
    }
});