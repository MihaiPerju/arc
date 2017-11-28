import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Container, Button, Divider, Header} from 'semantic-ui-react';
import RichTextArea from "/imports/client/lib/uniforms/RichTextArea.jsx";

export default class CreateLetterTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSubmit = (data) => {
        Meteor.call('letterTemplate.create', data, (err) => {
            if (!err) {
                FlowRouter.go('/letter-templates/list');
                Notifier.success('Letter template added!');
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    render() {
        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add a letter template</Header>
                <AutoForm schema={LetterTemplateSchema} onSubmit={this.onSubmit} ref="form">

                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <RichTextArea name="body"/>
                    <ErrorField name="body"/>

                    <AutoField name="category"/>
                    <ErrorField name="category"/>

                    <AutoField name="description"/>
                    <ErrorField name="description"/>

                    <Divider/>

                    <Button fluid primary type="submit">
                        Continue
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}