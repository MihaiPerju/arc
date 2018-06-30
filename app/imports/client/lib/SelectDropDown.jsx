import React from 'react';
import SimpleSchema from "simpl-schema";
import {AutoForm, SelectField} from 'uniforms-unstyled';

const SelectDropDownSchema = new SimpleSchema({
    selectedOption: {
        type: String
    }
});

export default class SelectDropDown extends React.Component {
    handleSelect = (data) => {
        const {selectionType, handleSelectBy} = this.props;
        handleSelectBy(selectionType, data.selectedOption);
    };

    render() {
        const {name, enums, defaultValue, regionOptions} = this.props;
        const model = {options: defaultValue ? defaultValue : {}};
        const placeholder = defaultValue ? defaultValue : `Select a ${name.toLowerCase()}`;
        const options = regionOptions ? regionOptions : _.map(enums, (value, key) => ({value, label: value}));
        const label = name ? name : false;

        return (
            <AutoForm autosave
                      autosaveDelay={0}
                      schema={SelectDropDownSchema}
                      model={model}
                      onSubmit={this.handleSelect}
            >
                <SelectField name="selectedOption"
                             label={label}
                             placeholder={placeholder}
                             options={options}/>
            </AutoForm>
        );
    }
}