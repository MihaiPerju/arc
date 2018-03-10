import SimpleSchema from 'simpl-schema';
import ContactTypes from '/imports/api/clients/enums/contactTypes';

export default new SimpleSchema ({
    contactType: {
        label: 'Contact type',
        type: String,
        allowedValues: [ContactTypes.TECHNICAL, ContactTypes.MANAGEMENT, ContactTypes.OTHER],
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
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    notes: {
        type: String,
        optional: true
    }
});