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
    shareReport: {
        type: Boolean,
        optional: true
    },
    createdBy: {
        type: String,
        optional: true
    }
});
