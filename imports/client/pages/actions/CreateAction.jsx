import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-unstyled';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

class CreateAction extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('action.create', data, (err)=> {
            if (!err) {
                Notifier.success('Action created !');
                FlowRouter.go('action.list');
            }
        });
    }

    render() {
        return (
            <AutoForm schema={CreateActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                {this.state.error
                    ? <div className="error">{this.state.error}</div>
                    : ''
                }

                <AutoField name="title"/>
                <ErrorField name="title"/>

                <LongTextField name="description"/>
                <ErrorField name="description"/>

                <button type="submit">
                    Add
                </button>
            </AutoForm>
        )
    }
}

const CreateActionSchema = new SimpleSchema({
    title: {type: String},
    description: {type: String}
});

export default CreateAction;