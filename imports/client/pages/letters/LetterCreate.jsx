import React from 'react';
import {AutoForm, ErrorField} from 'uniforms-semantic';
import {Button, Container, Header} from 'semantic-ui-react';
import SelectWithDescription from "/imports/client/lib/uniforms/SelectWithDescription.jsx"
import letterCreateActionSchema from "/imports/client/pages/letters/schemas/letterCreateAction.js";

class LetterCreate extends React.Component {
    onSubmit = (data) => {
        console.log(data)
    };

    render() {
        const {taskId} = this.props;
        const model = {letterTemplate: null};

        return (
            <Container>
                <Header as="h3" textAlign="center">Letter</Header>
                <AutoForm schema={letterCreateActionSchema} model={model} onSubmit={this.onSubmit}>
                    <SelectWithDescription placeholder={'Select one of the letter templates'} name="letterTemplate" options={options}/>
                    <ErrorField name="letterTemplate"/>

                    <Button primary fluid type="submit">
                        Proceed with letter creation
                    </Button>
                </AutoForm>
            </Container>
        );
    }
}


export default LetterCreate;