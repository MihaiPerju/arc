import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    content: {
        type: String
    },
    authorId: {
        type: String
    },
    taskId: {
        type: String
    },
    createdAt: {
        type: Date,
        defaultValue: new Date
    }
});