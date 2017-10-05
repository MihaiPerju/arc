import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({

    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Emai
    },
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
        type: String
    },
    notes: {
        type: String
    }
});