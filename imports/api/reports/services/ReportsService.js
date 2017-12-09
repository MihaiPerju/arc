import React from 'react';
import SimpleSchema from 'simpl-schema';

const stringMatchOptions = ['Contains', 'Not Contains', 'Is Exact'];

export default class ReportsService {

    static getInitialField(field) {
        if (field.endsWith('Match')) {
            field = field.substring(0, field.indexOf('Match'));
        } else if (field.endsWith('End')) {
            field = field.substring(0, field.indexOf('End'));
        } else if (field.endsWith('Start')) {
            field = field.substring(0, field.indexOf('Start'));
        }
        return field;
    }

    static getOptions(keys) {
        let schemaOptions = [];
        keys.map((value) => {
            schemaOptions.push({text: value, value});
        });
        return schemaOptions;
    }

    static getComponents(keys) {
        let components = {};

        keys.map((key) => {
            components[key] = {
                isActive: false,
                name: key
            }
        });

        return components;
    }

    static isEnum(name, reportFields) {
        return reportFields.enums.indexOf(name) !== -1;
    }

    static isDate(name, reportFields) {
        return reportFields.dates.indexOf(name) !== -1;
    }

    static isNumber(name, reportFields) {
        return reportFields.numbers.indexOf(name) !== -1;
    }

    static isLink(name, reportFields) {
        return reportFields.links.indexOf(name) !== -1;
    }

    static isString(name, reportFields) {
        return reportFields.strings.indexOf(name) !== -1;
    }

    static getFilters(data, components, reportFields) {
        const requiredFields = [];

        for (component in components) {
            if (components[component].isActive) {
                if (ReportsService.isLink(component, reportFields)) {
                    requiredFields.push(component);
                } else if (ReportsService.isDate(component, reportFields)) {
                    requiredFields.push(`${component}Start`, `${component}End`);
                } else if (ReportsService.isNumber(component, reportFields)) {
                    requiredFields.push(`${component}Start`, `${component}End`);
                } else if (ReportsService.isEnum(component, reportFields)) {
                    requiredFields.push(component);
                } else if (ReportsService.isString(component, reportFields)) {
                    requiredFields.push(component, `${component}Match`);
                }
            }
        }

        //If we don't have filters
        if (requiredFields.length === 0) {
            return {result: '', error: 'Select at least one filter!'};
        }

        //Creating filters
        let filters = {};
        let filterBuilderData = {};

        for (field of requiredFields) {
            //Field not completed
            if (!data[field]) {
                return {result: '', error: 'Filters uncomplete!'};
            }

            filterBuilderData[field] = data[field];

            //Removing 'Start' and 'End' prefixes if they are
            if (field.endsWith('Start')) {
                field = field.substr(0, field.indexOf('Start'));
            }
            if (field.endsWith('End')) {
                field = field.substr(0, field.indexOf('End'));
            }

            //Check type and create filter based on specific type information
            if (ReportsService.isEnum(field, reportFields)) {
                //If is Enum
                filters[field] = data[field];
            } else if (ReportsService.isNumber(field, reportFields)) {
                //If is Number
                filters[field] = {$gte: data[field + 'Start'], $lt: data[field + 'End']};
            } else if (ReportsService.isDate(field, reportFields)) {
                //If is Date
                filters[field] = {$gte: data[field + 'Start'], $lt: data[field + 'End']};
            } else if (ReportsService.isString(field, reportFields)) {
                //If is a string
                if (data[field + 'Match'] === stringMatchOptions[0]) {
                    filters[field] = {'$regex': data[field], '$options': 'i'};
                } else if (data[field + 'Match'] === stringMatchOptions[1]) {
                    filters[field] = {
                        $not: `/${data[field]}/`
                    };
                } else {
                    filters[field] = data[field];
                }
            } else if (ReportsService.isLink(field, reportFields)) {
                filters[field] = {$in: data[field]};
            }

        }
        return {result: filters, filterBuilderData};
    }

    static createSchema(keys, reportFields, Enums) {
        const allowedMatches = ['Contains', 'Not Contains', 'Is Exact'];

        const fields = {};
        keys.map((key) => {
            if (ReportsService.isString(key, reportFields)) {
                fields[key] = {
                    type: String,
                    optional: true
                };
                fields[`${key}Match`] = {
                    type: String,
                    allowedValues: allowedMatches,
                    optional: true
                }
            } else if (ReportsService.isLink(key, reportFields)) {
                fields[key] = {
                    type: Array,
                    optional: true
                };
                fields[`${key}.$`] = {
                    type: String
                }
            } else if (ReportsService.isDate(key, reportFields)) {
                fields[`${key}Start`] = {
                    type: Date,
                    optional: true
                };
                fields[`${key}End`] = {
                    type: Date,
                    optional: true
                }
            } else if (ReportsService.isNumber(key, reportFields)) {
                fields[`${key}Start`] = {
                    type: SimpleSchema.Integer,
                    optional: true
                };
                fields[`${key}End`] = {
                    type: SimpleSchema.Integer,
                    optional: true
                }
            } else if (ReportsService.isEnum(key, reportFields)) {
                fields[key] = {
                    type: String,
                    allowedValues: _.map(Enums[`${key}Enum`], (value, key) => (value)),
                    optional: true
                }
            }
        });

        return new SimpleSchema(fields);
    }
}