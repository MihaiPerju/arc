import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    type: {
        type: String
    },
    label: {
        type: String
    },
    isRequired: {
        type: Boolean,
        defaultValue: false
    }
})