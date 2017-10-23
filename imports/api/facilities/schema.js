import SimpleSchema from 'simpl-schema';
import FacilityContactSchema from '/imports/api/facilities/schemas/contactSchema.js';
import regionEnum from "/imports/api/facilities/enums/regions.js";
import statusEnum from "/imports/api/facilities/enums/statuses.js";
import ImportRulesSchema from './schemas/importRulesSchema.js';

export default new SimpleSchema({
    name: {
        type: String
    },
    clientId: {
        type: String
    },
    addressOne: {
        type: String,
        optional: true
    },
    addressTwo: {
        type: String,
        optional: true
    },
    city: {
        type: String,
        optional: true
    },
    state: {
        type: String,
        optional: true
    },
    zipCode: {
        type: SimpleSchema.Integer,
        optional: true
    },
    status: {
        type: String,
        allowedValues: _.map(statusEnum, (value, key) => (value))
    },
    region: {
        type: Array,
        minCount: 1
    },
    'region.$': {
        type: String,
        allowedValues: _.map(regionEnum, (value, key) => (value))
    },
    contacts: {
        type: Array,
        optional: true
    },
    'contacts.$': {
        type: FacilityContactSchema,
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    allowedUsers: {
        type: Array,
        optional: true
    },
    'allowedUsers.$': {
        type: String
    },
    importRules: {
        type: ImportRulesSchema,
        optional: true
    }
})