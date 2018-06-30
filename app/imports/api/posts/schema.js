import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    userId: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        defaultValue: new Date()
    }
});