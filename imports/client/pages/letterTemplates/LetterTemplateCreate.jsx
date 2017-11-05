import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class CreateLetterTemplate extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('letterTemplate.create', data, (err) => {
            if (!err) {
                FlowRouter.go('/letter-templates/list');
                Notifier.success('Letter template added!');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add a letter template</Header>
                <AutoForm schema={LetterTemplateSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <AutoField name="content"/>
                    <ErrorField name="content"/>

                    <Divider/>

                    <Button fluid primary type="submit">
                        Continue
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}