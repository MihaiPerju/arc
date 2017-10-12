import React from "react";
import SimpleSchema from "simpl-schema";
import {AutoForm, AutoField} from 'uniforms-unstyled';

const searchSchema = new SimpleSchema({
    search: {
        type: String,
        defaultValue: ''
    }
});

export default class FacilitySearch extends React.Component {
    handleSearch = (data) => {
        this.props.handleChange(data);
    };

    render() {
        return (
            <AutoForm autosave
                      autosaveDelay={300}
                      schema={searchSchema}
                      onSubmit={this.handleSearch}
            >
                <AutoField name="search"/>
            </AutoForm>
        )
    }
}