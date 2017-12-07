import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    name: {
        type: String
    },
    mongoFilters: {
        type: String,
        optional: true
    },
    filterBuilderData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    allowedRoles: {
        type: Array
    },
    'allowedRoles.$': {
        type: String
    }
});
