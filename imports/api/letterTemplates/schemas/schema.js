import SimpleSchema from 'simpl-schema';
import {CategoryList} from "/imports/api/letterTemplates/enums/categories.js";

export default new SimpleSchema({
    name: {
        type: String
    },
    body: {
        type: String
    },
    category: {
        type: String,
        allowedValues: CategoryList,

    },
    description: {
        type: String
    }
});