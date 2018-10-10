import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-unstyled';
import reasonCodeSchema from '/imports/api/reasonCodes/schema';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import actionQuery from '/imports/api/actions/queries/actionList';

class CreateReasonCode extends React.Component {
    constructor() {
        super();

        this.state = {
            actionOptions: [],
            error: null
        };
    }

    componentWillMount() {
        //Getting actions options
        let actionOptions = [{label: 'Select action'}];

        actionQuery.fetch((err, actions) => {
            if (!err) {
                actions.forEach((action) => {
                    actionOptions.push({
                        label: action.title,
                        value: action._id
                    })
                });
                this.setState({
                    actionOptions
                })
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    onSubmit(data) {
        //If no action selected
        if (data.actionId === 'Select action') {
            this.setState({
                error: 'Please choose action!'
            })
        } else {
            this.setState({
                error: null
            });
            Meteor.call('reasonCode.create', data, (err) => {
                if (!err) {
                    Notifier.success('Reason Code created !');
                    FlowRouter.go('/reason-codes/list');
                }
            });
        }

    }

    render() {
        const {actionOptions, error} = this.state;

        return (
            <Container className="page-container">
                <AutoForm schema={reasonCodeSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                    {error
                        ? <div className="error">{this.state.error}</div>
                        : ''
                    }
                    <AutoField name="actionId"
                               options={actionOptions}
                    />
                    <ErrorField name="actionId"/>

                    <AutoField name="reason"/>
                    <ErrorField name="reason"/>

                    <Divider/>

                    <Button primary fluid type="submit">
                        Create
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}

export default CreateReasonCode;