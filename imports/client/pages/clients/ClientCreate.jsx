import React from 'react';
import ClientSchema from '/imports/api/clients/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class CreateClient extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('client.create', data, (err, userId) => {
            if (!err) {
                FlowRouter.go('/client/' + userId + '/edit');
                Notifier.success('Client added!');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add a client</Header>
                <AutoForm schema={ClientSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                    {
                        this.state.error
                            ?
                            <div className="error">{this.state.error}</div>
                            :
                            ''
                    }

                    <AutoField name="clientName"/>
                    <ErrorField name="clientName"/>

                    <AutoField name="firstName"/>
                    <ErrorField name="firstName"/>

                    <AutoField name="lastName"/>
                    <ErrorField name="lastName"/>

                    <AutoField name="email"/>
                    <ErrorField name="email"/>

                    <Divider/>

                    <Button primary fluid type="submit">
                        Continue
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}