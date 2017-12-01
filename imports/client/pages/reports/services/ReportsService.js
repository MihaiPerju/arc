import React from 'react';

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

    static isComplete(data, components) {
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

        //If we don't have required fields
        if (requiredFields.length === 0) {
            return false;
        }

        //Looking for needed field
        for (field of requiredFields) {
            if (!data[field]) {
                return false;
            }
        }

        return true;
    }
}