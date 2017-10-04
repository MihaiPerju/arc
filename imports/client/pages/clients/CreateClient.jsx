import React from 'react';
import ClientSchema from '/imports/api/clients/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-unstyled';
import Notifier from '/imports/client/lib/Notifier';

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
            <div>
                <h2>Add a client</h2>
                <AutoForm schema={ClientSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                    {this.state.error
                        ? <div className="error">{this.state.error}</div>
                        : ''
                    }

                    <AutoField name="clientName"/>
                    <ErrorField name="clientName"/>

                    <AutoField name="firstName"/>
                    <ErrorField name="firstName"/>

                    <AutoField name="lastName"/>
                    <ErrorField name="lastName"/>

                    <AutoField name="email"/>
                    <ErrorField name="email"/>
                    <button type="submit">
                        Continue
                    </button>
                </AutoForm>
            </div>
        )
    }
}