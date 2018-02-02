import React from 'react';
import SimpleSchema from 'simpl-schema';
import { AutoForm, AutoField, RadioField } from 'uniforms-semantic';
import CodeEnum from '/imports/api/codes/enums/codes.js';

const searchSchema = new SimpleSchema({
    type: {
        label: 'Filter by type',
        type: String,
        allowedValues: [CodeEnum.RARC, CodeEnum.CARC],
        optional: true
    }
});

export default class FacilitySearch extends React.Component {
    handleFilter = (data) => {
        this.props.handleFilter(data.type);
    };

    render () {
        return (
            <AutoForm autosave
                      schema={searchSchema}
                      onSubmit={this.handleFilter}
            >
                <AutoField name="type"/>
            </AutoForm>
        );
    }
}