import SimpleSchema from 'simpl-schema';
import ContactTypes from '../enums/contactTypes';

export default new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    contactType: {
        label: 'Contact type',
        type: String,
        allowedValues: [ContactTypes.ADMIN, ContactTypes.TECH, ContactTypes.REP, ContactTypes.MANAGER],
        optional: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: String
    },
    notes: {
        type: String
    }
});