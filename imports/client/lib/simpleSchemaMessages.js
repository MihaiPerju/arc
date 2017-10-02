import SimpleSchema from 'simpl-schema';
// TODO this is a temporary solution until SimpleSchema issue gets fixed
global.Buffer = function() {};
global.Buffer.isBuffer = () => false;

SimpleSchema.setDefaultMessages({
    messages: {
        en: {
            'passwordMismatch': 'Passwords do not match'
        }
    }
});