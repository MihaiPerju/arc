import React from 'react';
import CodesSchema from '/imports/api/codes/schemas/schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import CodeEnum from '/imports/api/codes/enums/codes';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class CodeCreate extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('code.create', data, (err) => {
            if (!err) {
                FlowRouter.go('/code/list');
                Notifier.success('Code added!');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add a code</Header>
                <AutoForm schema={CodesSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                    {this.state.error && <div className="error">{this.state.error}</div>}
                    <AutoField name="code"/>
                    <ErrorField name="code"/>

                    <AutoField name="action"/>
                    <ErrorField name="action"/>

                    <AutoField name="type" initialValue={CodeEnum.CARC}/>
                    <ErrorField name="type"/>

                    <AutoField name="description"/>
                    <ErrorField name="description"/>

                    <AutoField name="description_short"/>
                    <ErrorField name="description_short"/>

                    <AutoField name="denial_action"/>
                    <ErrorField name="denial_action"/>

                    <Divider/>

                    <Button fluid primary type="submit">
                        Create
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}