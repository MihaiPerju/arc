import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-unstyled';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/actions/queries/actionList';

class EditAction extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(formData) {
        const {data} = this.props;

        Meteor.call('action.edit', data._id,  formData, (err)=> {
            if (!err) {
                Notifier.success('Data saved !');
                FlowRouter.go('action.list');
            }
        });
    }

    render() {
        const {data, loading, error} = this.props;

        return (
            <AutoForm schema={CreateActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form" model={data}>
                {this.state.error
                    ? <div className="error">{this.state.error}</div>
                    : ''
                }

                <AutoField name="title"/>
                <ErrorField name="title"/>

                <LongTextField name="description"/>
                <ErrorField name="description"/>

                <button type="submit">
                    Save
                </button>
            </AutoForm>
        )
    }
}

const CreateActionSchema = new SimpleSchema({
    title: {type: String},
    description: {type: String}
});


export default (props) => {
    const Container = createQueryContainer(query.clone({filters: {_id: FlowRouter.current().params.actionId}}), EditAction, {
        single: true
    });

    return <Container />
};