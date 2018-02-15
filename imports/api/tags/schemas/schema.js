import SimpleSchema from 'simpl-schema';
import userRoles from '/imports/api/users/enums/roles.js';

export default new SimpleSchema({
    name: {
        type: String
    },
    privacy: {
        type: String,
        allowedValues: ['Public', 'Private', 'Specific roles'],
        defaultValue: 'Public'
    },
    visibility: {
        label: "Visible for",
        type: Array,
        optional: true
    },
    'visibility.$': {
        type: String,
        allowedValues: _.map(userRoles, (value, key) => (value))
    },
    userId: {
        type: String,
        optional: true
    }
});