import config from '../config';
import SimpleSchema from 'simpl-schema';

let schema = {};

config.thumbs.forEach(size => {
    schema[`${size}x${size}`] = {
        type: String,
        optional: true
    }
});

export default new SimpleSchema(schema);