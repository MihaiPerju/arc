import React from 'react';
import InsCompanySchema from '/imports/api/insCompanies/schemas/schema';
import { AutoForm, AutoField, ErrorField } from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import { Container } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Divider } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';

export default class InsCompanyEdit extends React.Component {
    constructor () {
        super();

        this.state = {
            model: {},
            error: null
        };
    }

    componentWillMount () {
        Meteor.call('inscompany.get', FlowRouter.current().params.id, (error, model) => {
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

    onSubmit (data) {
        Meteor.call('inscompany.update', data, (err) => {
            if (!err) {
                Notifier.success('Data saved');
                FlowRouter.go('/inscompany/list');
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    render () {
        const {model} = this.state;

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Edit Insurance company</Header>
                {
                    this.state.error
                        ? <div className="error">{this.state.error}</div>
                        : <AutoForm model={model} schema={InsCompanySchema} onSubmit={this.onSubmit.bind(this)}
                                    ref="form">

                            <AutoField name="name"/>
                            <ErrorField name="name"/>

                            <AutoField name="aliases"/>
                            <ErrorField name="aliases"/>

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