import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField, SelectField } from 'uniforms-semantic';
import ActionSchema from '/imports/api/actions/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import {LabelSubstates} from '/imports/api/tasks/enums/substates.js';
import {StatesSubstates, findStateBySubstate} from '/imports/api/tasks/enums/states.js';

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
        return _.map(enums, (value, key) => {
            const labelPrefix = findStateBySubstate(StatesSubstates, key);
            const label = `${labelPrefix}: ${value}`;
            return {value: key, label: label};
        })
    };

    handleClick() {
        const currentState = this.state.checked;
        this.setState({
            checked: !currentState
        })
    }

    render() {
        const substates = this.getOptions(LabelSubstates);

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Add an action</Header>
                <AutoForm schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                    
                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <AutoField name="title"/>
                    <ErrorField name="title"/>

                    <LongTextField name="description"/>
                    <ErrorField name="description"/>

                    <input type="checkbox" onClick={this.handleClick}/>Changes the substate of the Account?

                    {this.state.checked &&
                        <div>
                            <SelectField name="substate" options={substates}/>
                            <ErrorField name="substate"/>
                        </div> 
                    }

                    {!this.state.checked &&
                        <div className="display-none">
                            <SelectField value='N/A' name="substate" options={'N/A'}/>
                            <ErrorField name="substate"/>
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
