import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    clientName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    logoPath: {
        type: String,
        optional: true
    }
});