import React from 'react';
import {AutoForm, AutoField, ErrorField, LongTextField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import reasonCodeSchema from '/imports/api/reasonCodes/schema';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import reasonCodesQuery from '/imports/api/reasonCodes/queries/reasonCodesList';
import actionQuery from '/imports/api/actions/queries/actionList';

export default class ReasonCodeEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            data: {},
            actionOptions: []
        };
    }

    componentWillMount() {
        //Getting the reason code
        const _id = FlowRouter.current().params.id;
        reasonCodesQuery.clone({_id}).fetchOne((err, data) => {
            if (!err) {
                this.setState({
                    data
                })
            } else {
                Notifier.error(err.reason);
            }
        });

        //Getting action options
        let actionOptions = [];
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
        Meteor.call('reasonCode.edit', data, (err) => {
            if (!err) {
                Notifier.success('Data saved !');
                FlowRouter.go('/reason-codes/list');
            }
        });
    }

    render() {
        const {data, actionOptions} = this.state;

        return (
            <Container className="page-container">
                <AutoForm schema={reasonCodeSchema} onSubmit={this.onSubmit.bind(this)} ref="form" model={data}>

                    <AutoField name="actionId" options={actionOptions}/>
                    <ErrorField name="actionId"/>

                    <AutoField name="reason"/>
                    <ErrorField name="reason"/>

                    <Divider/>

                    <Button primary fluid type="submit">
                        Save
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}