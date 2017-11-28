import SimpleSchema from 'simpl-schema';

export default new SimpleSchema ({
    letterTemplate: {
        type: Object
    },
    'letterTemplate.label': {
        type: String
    },
    'letterTemplate.value': {
        type: String
    },
    'letterTemplate.description': {
        type: String
    }
});