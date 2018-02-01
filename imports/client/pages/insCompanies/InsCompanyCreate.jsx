import React from 'react';
import InsCompanySchema from '/imports/api/insCompanies/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class InsCompanyCreate extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('inscompany.create', data, (err) => {
            if (!err) {
                Notifier.success('Insurance company added!');
                FlowRouter.go('/inscompany/list');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add a insurance company</Header>
                <AutoForm schema={InsCompanySchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <AutoField name="aliases"/>
                    <ErrorField name="aliases"/>

                    <Divider/>

                    <Button fluid primary type="submit">
                        Continue
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}