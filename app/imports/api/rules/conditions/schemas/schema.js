import SimpleSchema from 'simpl-schema';
import {
    conditionTypes
} from "../enums/conditionTypes";

export default new SimpleSchema({
    type: {
        type: String,
        allowedValues: conditionTypes
    },
});