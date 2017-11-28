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
}