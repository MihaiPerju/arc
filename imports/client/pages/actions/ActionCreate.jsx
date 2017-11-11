import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField, SelectField, BoolField } from 'uniforms-semantic';
import ActionSchema from '/imports/api/actions/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import TaskStatesEnum from '/imports/api/tasks/enums/states.js';

export default class ActionCreate extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            checked: false
        };
    }

    onSubmit(data) {
        Meteor.call('action.create', data, (err)=> {
            if (!err) {
                FlowRouter.go('/action/list');                
                Notifier.success('Action created!');
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    getOptions = (enums) => {
        return _.map(enums, (value, key) => ({value, label: value}));
    };

    handleClick() {
        console.log(this.state);
        const currentState = this.state.checked;
        this.setState({
            checked: !currentState
        })
    }

    render() {
        const states = this.getOptions(TaskStatesEnum);

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add an action</Header>
                <AutoForm schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                    
                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="title"/>
                    <ErrorField name="title"/>

                    <LongTextField name="description"/>
                    <ErrorField name="description"/>

                    <input type="checkbox" onClick={this.handleClick}/>Changes the status of the Account?

                    {this.state.checked 
                        ?
                        <div>
                            <SelectField name="state" options={states}/>
                            <ErrorField name="state"/>
                        </div> 
                        : 
                        <div className="display-none">
                            <SelectField value='N/A' name="state"/>
                            <ErrorField name="state"/>
                        </div>
                    }
                    <Button fluid primary type="submit">
                        Create
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}
