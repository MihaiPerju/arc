import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import {AutoForm, AutoField, ErrorField, LongTextField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

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

    onSubmit = (data) => {
        data.id = this.state.model._id;
        Meteor.call('letterTemplate.update', data, (err) => {
            if (!err) {
                Notifier.success("Data saved");
                FlowRouter.go('/letter-templates/list');
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    render() {
        const {model} = this.state;

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Edit Letter template</Header>
                {
                    this.state.error
                        ?
                        <div className="error">{this.state.error}</div>
                        :
                        <AutoForm model={model} schema={LetterTemplateSchema} onSubmit={this.onSubmit}
                                  ref="form">

                            <AutoField name="name"/>
                            <ErrorField name="name"/>

                            <LongTextField name="body"/>
                            <ErrorField name="body"/>

                            <AutoField name="category"/>
                            <ErrorField name="category"/>

                            <AutoField name="description"/>
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