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
    },
    contacts: {
        type: Array,
        optional: true
    },
    'contacts.$': {
        type: Object,
        blackbox: true
    },
    'contacts.$.email': {
        type: String,
        regEx: SimpleSchema.RegEx.Emai
    },
    'contacts.$.contactDescription': {
        type: String
    },
    'contacts.$.firstName': {
        type: String
    },
    'contacts.$.lastName': {
        type: String
    },
    'contacts.$.phone': {
        type: String
    },
    'contacts.$.notes': {
        type: String
    }
});