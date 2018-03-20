import FieldsEnum from '/imports/api/facilities/enums/importingRules';
import SimpleSchema from 'simpl-schema';

export default class ImportingRulesService {
    static createSchema(rules, hasHeader) {
        let schemaObj = {
            hasHeader: {
                type: Boolean,
                allowedValues: [true, false],
                defaultValue: hasHeader ? hasHeader : true,
                label: 'File with header'
            },
        };
        FieldsEnum[rules].forEach((field) => {
            schemaObj[field.value] = {
                type: hasHeader ? String : SimpleSchema.Integer,
                optional: field.optional,
                label: field.label
            }
        });
        if (rules === 'paymentRules') {
            schemaObj.newInsBal = {
                type: Array,
                optional: true,
                label: "New Insurance Balance"
            };
            schemaObj['newInsBal.$'] = {
                type: new SimpleSchema({
                    insBal: {
                        type: hasHeader ? String : SimpleSchema.Integer,
                        label: "Insurance Balance"
                    }
                })
            };

        } else {
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
        }
        return new SimpleSchema(schemaObj);
    }

    static getSchemaFields(rules) {
        const fields = [];

        for (let key in FieldsEnum[rules]) {
            fields.push({value: FieldsEnum[rules][key].value, label: FieldsEnum[rules][key].label});
        }
        return fields;
    }
}