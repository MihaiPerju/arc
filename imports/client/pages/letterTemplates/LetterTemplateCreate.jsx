import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-unstyled';
import Notifier from '/imports/client/lib/Notifier';

export default class CreateLetterTemplate extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('letterTemplate.create', data, (err) => {
            if (!err) {
                FlowRouter.go('/letter-templates/list');
                Notifier.success('Letter template added!');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        return (
            <div>
                <h2>Add a letter template</h2>
                <AutoForm schema={LetterTemplateSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                    {
                        this.state.error
                            ?
                            <div className="error">{this.state.error}</div>
                            :
                            ''
                    }

                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <AutoField name="content"/>
                    <ErrorField name="content"/>

                    <button type="submit">
                        Continue
                    </button>
                </AutoForm>
            </div>
        )
    }
}