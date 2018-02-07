import SimpleSchema from 'simpl-schema';
import ContactSchema from './contactSchema';

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
    logoId: {
        type: String,
        optional: true
    },
    contacts: {
        type: Array,
        optional: true
    },
    'contacts.$': {
        type: ContactSchema,
    }
});