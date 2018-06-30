import React from "react";
import SimpleSchema from "simpl-schema";
import {AutoForm, AutoField} from 'uniforms-unstyled';

const searchSchema = new SimpleSchema({
    searchValue: {
        type: String,
        defaultValue: ''
    }
});

export default class FacilitySearch extends React.Component {
    handleSearch = (data) => {
        this.props.handleSearch(data.searchValue);
    };

    render() {
        return (
            <AutoForm autosave
                      autosaveDelay={300}
                      schema={searchSchema}
                      onSubmit={this.handleSearch}
            >
                <AutoField name="searchValue"/>
            </AutoForm>
        )
    }
}