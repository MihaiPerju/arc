import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    rule: {
        type: Array,
        optional: true
    },
    "rule.$": {
        type: Object,
        optional: true,
        blackbox: true
    }
});