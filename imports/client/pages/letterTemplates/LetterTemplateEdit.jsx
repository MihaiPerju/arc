import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import {AutoForm, AutoField, ErrorField, ListField, ListItemField, NestField, TextField} from 'uniforms-unstyled';
import Notifier from '/imports/client/lib/Notifier';

export default class EditLetterTemplate extends React.Component {
    constructor() {
        super();

        this.state = {
            model: {},
            error: null
        };
    }

    componentWillMount() {
        Meteor.call('letterTemplate.get', FlowRouter.current().params.id, (error, model) => {
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
        data.id = this.state.model._id;
        Meteor.call('letterTemplate.update', data, (err) => {
            if (!err) {
                Notifier.success("Data saved");
                FlowRouter.go('/letter-templates/list');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {model} = this.state;

        return (
            <div>
                <h2>Edit Letter template</h2>

                {
                    this.state.error
                        ?
                        <div className="error">{this.state.error}</div>
                        :
                        (
                            <AutoForm model={model} schema={LetterTemplateSchema} onSubmit={this.onSubmit.bind(this)}
                                      ref="form">

                                <AutoField name="name"/>
                                <ErrorField name="name"/>

                                <AutoField name="content"/>
                                <ErrorField name="content"/>

                                <button type="submit">
                                    Save
                                </button>
                            </AutoForm>
                        )
                }
            </div>
        )
    }
}