import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Dialog from '/imports/client/lib/ui/Dialog';
import { AutoForm, AutoField, ErrorField, HiddenField } from 'uniforms-semantic';
import reasonCodesQuery from '/imports/api/reasonCodes/queries/reasonCodesList.js';
import reasonCodesSchema from '/imports/api/reasonCodes/schema.js';
import ReasonCodesList from './ReasonCodesList';
import Notifier from '/imports/client/lib/Notifier';

export default class ReasonCodesDialog extends Component {
    constructor () {
        super();

        this.state = {
            reasonCodes: []
        };
    }

    componentWillMount () {
        reasonCodesQuery.clone({
            filters: {
                actionId: this.props.actionId
            }
        }).fetch((err, reasonCodes) => {
            if (!err) {
                this.setState({
                    reasonCodes
                });
            }
        });
    }

    onSubmitForm = (model) => {
        const {reasonCodes} = this.state;

        Meteor.call('reasonCode.create', model, (err, _id) => {
            if (!err) {
                Notifier.success('Reason code has been created !');
                model._id = _id;
                reasonCodes.push(model);
                this.setState({
                    reasonCodes
                });
                this.refs.reasonForm.reset();
            }
        });
    };

    onChange = (reasonCodes) => {
        this.setState({
            reasonCodes
        });
    };

    render () {
        const {reasonCodes} = this.state;
        const actions = [
            <Button onClick={this.props.closeAction}>Close</Button>
        ];
        return (
            <div>
                <Dialog closePortal={this.props.closeAction} title="Manage Reason Codes" actions={actions}>

                    <AutoForm schema={reasonCodesSchema} onSubmit={this.onSubmitForm}
                              ref="reasonForm">

                        <AutoField name="reason"/>
                        <ErrorField name="reason"/>

                        <HiddenField name='actionId' value={this.props.actionId}/>

                        <Button color="green">Create new Reason Code</Button>
                    </AutoForm>

                    <h2>List of available Reason Codes</h2>
                    <ReasonCodesList reasonCodes={reasonCodes} onChange={this.onChange}/>

                </Dialog>
            </div>
        );

    }
}