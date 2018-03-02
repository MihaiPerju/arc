import React from 'react';
import RegionSchema from '/imports/api/regions/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class RegionCreate extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        data.clientId = FlowRouter.current().params.id;
        Meteor.call('region.create', data, (err) => {
            if (!err) {
                Notifier.success('Region added!');
                FlowRouter.go('region.list', {id: FlowRouter.current().params.id});
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const schema = RegionSchema.omit('clientId');
        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add a region</Header>
                <AutoForm schema={schema} onSubmit={this.onSubmit.bind(this)} ref="form">

                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <Divider/>

                    <Button fluid primary type="submit">
                        Continue
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}