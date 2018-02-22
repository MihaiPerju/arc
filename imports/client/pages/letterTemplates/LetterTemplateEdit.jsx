import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import { AutoForm, AutoField, ErrorField } from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import { Container } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Divider } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';
import RichTextArea from '/imports/client/lib/uniforms/RichTextArea.jsx';
import codesQuery from '/imports/api/codes/queries/listCodeNames';
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";

export default class EditLetterTemplate extends React.Component {
    constructor () {
        super();

        this.state = {
            model: {},
            error: null,
            codes: []
        };
    }

    componentWillMount () {
        codesQuery.clone({}).fetch((err, codes) => {
            if (!err) {
                this.setState({
                    codes
                });
            } else {
                Notifier.error('Couldn\'t get carc/rarc codes');
            }
        });

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
        });
    }

    onSubmit = (data) => {
        data.id = this.state.model._id;
        Meteor.call('letterTemplate.update', data, (err) => {
            if (!err) {
                Notifier.success('Data saved');
                FlowRouter.go('/letter-templates/list');
            } else {
                Notifier.error(err.reason);
            }
        });
    };

    getCodeOptions (codes) {
        return _.map(codes, ({_id, code}) => {
            return {value: _id, label: code};
        })
    }

    render () {
        const {model} = this.state;
        const codeIds = this.getCodeOptions(this.state.codes);

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Edit Letter template</Header>
                {
                    this.state.error
                        ? <div className="error">{this.state.error}</div>
                        : <AutoForm model={model} schema={LetterTemplateSchema} onSubmit={this.onSubmit}
                                    ref="form">

                            <AutoField name="name"/>
                            <ErrorField name="name"/>

                            <RichTextArea name="body"/>
                            <ErrorField name="body"/>

                            <AutoField name="category"/>
                            <ErrorField name="category"/>

                            <AutoField name="description"/>
                            <ErrorField name="description"/>

                            {
                                codeIds && model.codeIds &&
                                <SelectMulti name="codeIds" options={codeIds}/>
                            }

                            <ErrorField name="codeIds"/>

                            <Divider/>
                            <Button fluid primary type="submit">
                                Save
                            </Button>
                        </AutoForm>
                }
            </Container>
        );
    }
}