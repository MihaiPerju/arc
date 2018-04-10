import React from 'react';
import SimpleSchema from "simpl-schema";
import {AutoForm, SelectField} from 'uniforms-semantic';
import variablesEnum from "/imports/api/letterTemplates/enums/variablesEnum";

const SelectDropDownSchema = new SimpleSchema({
    selectedOption: {
        type: String
    }
});

export default class EditorDropdown extends React.Component {
    handleSelect = ({selectedOption}) => {
        const {editorState, setEditorValue} = this.props;
        setEditorValue(selectedOption, editorState);
        this.refs.form.reset();
    };

    render() {
        return (
            <AutoForm autosave
                      autosaveDelay={0}
                      schema={SelectDropDownSchema}
                      onSubmit={this.handleSelect}
                      ref="form"
            >
                <SelectField name="selectedOption"
                             placeholder="Select variables"
                             options={variablesEnum}/>
            </AutoForm>
        );
    }
}