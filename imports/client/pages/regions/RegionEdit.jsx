import React from 'react';
import RegionSchema from '/imports/api/regions/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class RegionEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            model: {},
            error: null
        };
    }

    componentWillMount() {
        Meteor.call('region.get', FlowRouter.current().params.id, (error, model) => {
            if (!error) {
                if (model) {
                    this.setState({model});
                } else {
                    this.setState({error: 'Invalid request!'});
                    Notifier.error('Invalid request!');
                }
            } else {
                this.setState({error});
                Notifier.error(error.reason);
            }
        })
    }

    onSubmit(data) {
        data._id = this.state.model._id;
        Meteor.call('region.update', data, (err) => {
            if (!err) {
                Notifier.success("Data saved");
                // FlowRouter.go('/regions/list');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {model} = this.state;

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Edit Region</Header>
                {
                    this.state.error
                        ?
                        <div className="error">{this.state.error}</div>
                        :
                        <AutoForm model={model} schema={RegionSchema} onSubmit={this.onSubmit.bind(this)}
                                  ref="form">

                            <AutoField name="name"/>
                            <ErrorField name="name"/>

                            <Divider/>

                            <Button fluid primary type="submit">
                                Save
                            </Button>
                        </AutoForm>
                }
            </Container>
        )
    }
}