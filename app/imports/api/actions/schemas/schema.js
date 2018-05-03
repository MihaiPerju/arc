import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    title: {
        type: String
    },
    description: {
        type: String,
        optional: true
    },
    substate: {
        type: String,
        optional: true
    },
    systemAction: {
        type: Boolean,
        defaultValue: false
    }
});