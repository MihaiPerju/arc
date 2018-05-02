import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import {Container, Button, Divider, Header} from 'semantic-ui-react';
import RichTextArea from "/imports/client/lib/uniforms/RichTextArea.jsx";
import codesQuery from '/imports/api/codes/queries/listCodeNames';
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";

export default class CreateLetterTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codes: []
        };
    }

    onSubmit(data) {
        Meteor.call('letterTemplate.create', data, (err) => {
            if (!err) {
                FlowRouter.go('/letter-templates/list');
                Notifier.success('Letter template added!');
            } else {
                Notifier.error(err.reason);
            }
        });
    };

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
    }

    getCodeOptions (codes) {
        return _.map(codes, ({_id, code}) => {
            return {value: _id, label: code};
        })
    }

    render() {
        const codeIds = this.getCodeOptions(this.state.codes);

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add a letter template</Header>
                <AutoForm schema={LetterTemplateSchema} onSubmit={this.onSubmit} ref="form">

                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <RichTextArea name="body"/>
                    <ErrorField name="body"/>

                    <AutoField name="category"/>
                    <ErrorField name="category"/>

                    <AutoField name="description"/>
                    <ErrorField name="description"/>

                    {
                        codeIds &&
                        <SelectMulti name="codeIds" options={codeIds}/>
                    }

                    <Divider/>

                    <Button fluid primary type="submit">
                        Create
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}
