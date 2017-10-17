import React from 'react';
import {AutoForm, AutoField, ErrorField, LongTextField} from 'uniforms-unstyled';
import CodesSchema from '/imports/api/codes/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import query from '/imports/api/codes/queries/listCodes';

export default class CodeEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null,
            code: {}
        };
    }

    componentWillMount() {
        query.clone({
            filters: {
                _id: FlowRouter.current().params.id
            }
        }).fetchOne((err, code) => {
            if (!err) {
                if (code) {
                    this.setState({
                        code
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
        Meteor.call('code.edit', FlowRouter.current().params.id, formData, (err) => {
            if (!err) {
                Notifier.success('Data saved !');
                FlowRouter.go('/code/list');
            } else {
                Notifier.error("An error occurred!");
            }
        });
    }

    render() {
        const {code} = this.state;

        return (
            <div>
                {
                    this.state.error
                        ?
                        <div className="error">{this.state.error}</div>
                        :
                        <AutoForm schema={CodesSchema} onSubmit={this.onSubmit.bind(this)} ref="form" model={code}>

                            <AutoField name="code"/>
                            <ErrorField name="code"/>

                            <AutoField name="action"/>
                            <ErrorField name="action"/>

                            <AutoField name="type"/>
                            <ErrorField name="type"/>

                            <AutoField name="description"/>
                            <ErrorField name="description"/>

                            <AutoField name="description_short"/>
                            <ErrorField name="description_short"/>

                            <LongTextField name="denial_action"/>
                            <ErrorField name="denial_action"/>

                            <button type="submit">
                                Save
                            </button>
                        </AutoForm>
                }
            </div>
        )
    }
}

