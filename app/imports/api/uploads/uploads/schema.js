import ThumbsSchema from './thumbsSchema';
import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    name: {
        type: String
    },

    resourceId: {
        type: String,
        optional: true
    },

    resourceType: {
        type: String,
        optional: true
    },

    userId: {
        type: String,
        optional: true
    },

    mimeType: {
        type: String
    },

    path: {
        type: String
    },

    size: {
        type: Number
    },

    thumbs: {
        type: ThumbsSchema,
        optional: true
    },

    uploadedAt: {
        type: Date,
        optional: true
    }
});