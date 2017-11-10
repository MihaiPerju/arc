import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-semantic';
import ActionSchema from '/imports/api/actions/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/actions/queries/actionList';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

export default class ActionEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            model: {},
            error: null
        };
    }

    componentDidMount() {
        query.clone({
            filters: {
                _id: this.props.actionId
            }
        }).fetchOne((err, model) => {
            if (!err) {
                if (model) {
                    this.setState({
                        model
                    })
                } else {
                    this.setState({
                        error: 'Invalid request'
                    });
                    Notifier.error('Invalid request');
                }
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    onSubmit(formData) {
        Meteor.call('action.edit', this.props.actionId,  formData, (err)=> {
            if (!err) {
                Notifier.success('Data saved!');
                FlowRouter.go('/action/list');
            } else {
                Notifier.error("An error occurred!");
            }
        });
    }

    render() {
        const {model} = this.state;

        return (
            <Container className="page-container">
                {
                    this.state.error
                        ?
                        <div className="error">{this.state.error}</div>
                        :
                        <AutoForm model={model} schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                    
                            <AutoField name="title"/>
                            <ErrorField name="title"/>

                            <LongTextField name="description"/>
                            <ErrorField name="description"/>

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
