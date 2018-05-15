import SimpleSchema from 'simpl-schema';
import inputSchema from './inputSchema'

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
    },
    inputs: {
        type: Array,
        optional: true
    },
    'inputs.$': {
        type: inputSchema,
        optional: true
    }
});