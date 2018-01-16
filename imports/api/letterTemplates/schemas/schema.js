import SimpleSchema from 'simpl-schema';
import CATEGORIES, {CategoryList} from '/imports/api/letterTemplates/enums/categories.js';

export default new SimpleSchema({
    name: {
        type: String,
    },
    body: {
        type: String,
    },
    category: {
        type: String,
        allowedValues: CategoryList,
        defaultValue: CATEGORIES.VENDOR,
    },
    description: {
        type: String,
        optional: true,
    },
    keywords: {
        type: Array,
        optional: true
    },
    'keywords.$': {
        type: String,
    },
    createdAt: {
        type: Date,
        optional: true,
    }
});