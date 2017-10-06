import SimpleSchema from 'simpl-schema';

export default new SimpleSchema ({
    contactDescription: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: SimpleSchema.Integer
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