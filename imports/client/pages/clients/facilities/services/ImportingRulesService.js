import FieldsEnum from '/imports/api/facilities/enums/importingRules';
import SimpleSchema from 'simpl-schema';

export default class ImportingRulesService {
    static createSchema(hasHeader) {
        let schemaObj = {
            hasHeader: {
                type: Boolean,
                allowedValues: [true, false],
                defaultValue: hasHeader,
                label: 'Does the file have a header?'
            },
        };
        FieldsEnum.importingRules.forEach((field) => {
            schemaObj[field.value] = {
                type: hasHeader ? String : SimpleSchema.Integer,
                optional: true,
                label: field.label
            }
        });
        schemaObj.insurances = {
            type: Array,
            optional: true,
            label: "Insurances"
        };
        schemaObj['insurances.$'] = {
            type: new SimpleSchema({
                insName: {
                    type: hasHeader ? String : SimpleSchema.Integer,
                    label: "Insurance Name"
                },
                insCode: {
                    type: hasHeader ? String : SimpleSchema.Integer,
                    label: "Insurance Code"
                },
                insBal: {
                    type: hasHeader ? String : SimpleSchema.Integer,
                    label: "Insurance Balance"
                }
            })
        };
        return new SimpleSchema(schemaObj);
    }

    static getSchemaFields() {
        const fields = [];
        for (let key in FieldsEnum.importingRules) {
            fields.push(FieldsEnum.importingRules[key].value);
        }
        return fields;
    }
}