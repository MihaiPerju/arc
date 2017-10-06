import SimpleSchema from 'simpl-schema';
import FacilityContactSchema from '/imports/api/facilities/schemas/contactSchema.js';

export default new SimpleSchema ({
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
    zip: {
        type: SimpleSchema.Integer,
        optional: true
    },
    status: {
        type: String,
        //allowedValues
    },
    region: {
        type: String
    },
    contacts: {
        type: Array,
        optional: true
    },
    'contacts.$': {
        type: FacilityContactSchema,
        optional: true
    }
})