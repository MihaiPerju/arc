import SimpleSchema from 'simpl-schema';
import FacilityContactSchema from '/imports/api/facilities/schemas/contactSchema.js';
import regionsEnum from "/imports/api/facilities/enums/regions.js";

export default new SimpleSchema ({
    name: {
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
    region: {
        type: String,
        //allowedValues: _.map(regionsEnum, (value, key) => (value))
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