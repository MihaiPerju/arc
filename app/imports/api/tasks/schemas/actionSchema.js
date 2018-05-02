import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    title: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
    },
    userId: {
        type: String,
    },
    _id: {
        type: String,
        optional: true
    }
});