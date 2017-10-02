import SimpleSchema from 'simpl-schema';

const MyProfileSchema = new SimpleSchema({
    profile: {
        type: Object
    },
    'profile.firstName': {type: String},
    'profile.lastName': {type: String},
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    }
});

export default MyProfileSchema;