import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    title: {
        type: String
    },
    description: {
        type: String,
        optional: true        
    },
    state: {
        type: String,
        optional: true
    }
});