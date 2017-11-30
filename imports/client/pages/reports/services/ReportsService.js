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
        return name === 'state' || name === 'substate';
    }

    static isDate(name) {
        return name === 'dischrgDate' || name === 'fbDate' || name === 'admitDate';
    }

    static isNumber(name) {
        return name === 'medNo' || name === 'insCode' || name === 'insCode2' || name === 'insCode3' || name === 'insBal' || name === 'insBal2' || name === 'insBal3' || name === 'acctBal';
    }

    static isLink(name) {
        return name === 'facilityId' || name === 'assigneeId';
    }
}