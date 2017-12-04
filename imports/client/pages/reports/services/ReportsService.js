import React from 'react';

const stringMatchOptions = ['Contains', 'Not Contains', 'Is Exact'];

export default class ReportsService {

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

    static isEnum(name) {
        return ['state', 'substate'].indexOf(name) !== -1;
    }

    static isDate(name) {
        return ['dischrgDate', 'fbDate', 'admitDate'].indexOf(name) !== -1;
    }

    static isNumber(name) {
        return ['medNo', 'insCode', 'insCode2', 'insCode3',
            'insBal', 'insBal2', 'insBal3', 'acctBal'].indexOf(name) !== -1;
    }

    static isLink(name) {
        return ['facilityId', 'assigneeId'].indexOf(name) !== -1;
    }

    static isString(name) {
        return ['acctNum', 'facCode', 'ptType', 'ptName',
            'finClass', 'insName', 'insName2', 'insName3',].indexOf(name) !== -1;
    }

    static getFilters(data, components) {
        const requiredFields = [];

        for (component in components) {
            if (components[component].isActive) {
                if (ReportsService.isLink(component)) {
                    requiredFields.push(component);
                } else if (ReportsService.isDate(component)) {
                    requiredFields.push(`${component}Start`, `${component}End`);
                } else if (ReportsService.isNumber(component)) {
                    requiredFields.push(`${component}Start`, `${component}End`);
                } else if (ReportsService.isEnum(component)) {
                    requiredFields.push(component);
                } else {
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

        for (field of requiredFields) {
            //Field not completed
            if (!data[field]) {
                return {result: '', error: 'Filters uncomplete!'};
            }

            //Creating filters

            //Removing 'Start' and 'End' prefixes if they are
            if (field.endsWith('Start')) {
                field = field.substr(0, field.indexOf('Start'));
            }
            if (field.endsWith('End')) {
                field = field.substr(0, field.indexOf('End'));
            }

            //Check type and create filter based on specific type information
            if (ReportsService.isEnum(field)) {
                //If is Enum
                filters[field] = data[field];
            } else if (ReportsService.isNumber(field)) {
                //If is Number
                filters[field] = {$gte: data[field + 'Start'], $lt: data[field + 'End']};
            } else if (ReportsService.isDate(field)) {
                //If is Date
                filters[field] = {$gte: data[field + 'Start'], $lt: data[field + 'End']};
            } else if (ReportsService.isString(field)) {
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
            } else if (ReportsService.isLink(field)) {
                filters[field] = {$in: data[field]};
            }

        }
        return {result: filters};
    }
}