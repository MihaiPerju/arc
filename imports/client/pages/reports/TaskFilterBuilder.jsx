import React from 'react';
import {Container, Select} from 'semantic-ui-react'
import TaskSchema from '/imports/api/tasks/schema';
import {AutoForm, ErrorField, SelectField} from 'uniforms-semantic';

export default class TaskFilterBuilder extends React.Component {
    constructor() {
        super();

        this.state = {
            schemaOptions: []
        }
    }

    componentWillMount() {
        // console.log(TaskSchema);
        let schemaOptions = [];
        TaskSchema._schemaKeys.map((value) => {
            // console.log(value);
            schemaOptions.push({text: value, value});
        });
        this.setState({schemaOptions});
    }

    render() {
        const {schemaOptions} = this.state;
        console.log(schemaOptions);
        return (
            <Container>
                OK! Rendered!
                <Select placeholder="Task fields" options={schemaOptions}/>
            </Container>
        )
    }
}