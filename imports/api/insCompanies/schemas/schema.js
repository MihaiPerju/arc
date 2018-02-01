import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    name: {
        type: String
    },
    aliases: {
        label: 'Aliases',
        type: Array,
        optional: true
    },
    'aliases.$': {
        type: String,
    },
});