import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-semantic';
import ActionSchema from '/imports/api/actions/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class ActionCreate extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('action.create', data, (err)=> {
            if (!err) {
                FlowRouter.go('/action/list');                
                Notifier.success('Action created!');
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    render() {
        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add an action</Header>
                <AutoForm schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                    
                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="title"/>
                    <ErrorField name="title"/>

                    <LongTextField name="description"/>
                    <ErrorField name="description"/>

                    <Button fluid primary type="submit">
                        Create
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}
