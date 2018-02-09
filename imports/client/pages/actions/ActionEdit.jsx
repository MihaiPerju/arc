import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField, SelectField } from 'uniforms-semantic';
import ActionSchema from '/imports/api/actions/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/actions/queries/actionList';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {LabelSubstates} from '/imports/api/tasks/enums/substates.js';
import {StatesSubstates, findStateBySubstate} from '/imports/api/tasks/enums/states.js';

export default class ActionEdit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            model: {},
            error: null,
            checked: false
        };
    }

    componentDidMount() {
        query.clone({
            filters: {
                _id: this.props.actionId
            }
        }).fetchOne((err, model) => {
            if (!err) {
                if (model) {
                    this.setState({
                        model
                    })
                    if(model.substate && model.substate !== 'N/A') {
                        this.setState({
                            checked: true
                        })
                    }
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
        Meteor.call('action.edit', this.props.actionId, formData, (err)=> {
            if (!err) {
                Notifier.success('Data saved!');
                FlowRouter.go('/action/list');
            } else {
                Notifier.error("An error occurred!");
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
        const {model} = this.state;
        const substates = this.getOptions(LabelSubstates);
        return (
            <Container className="page-container">
                {
                    this.state.error
                        ?
                        <div className="error">{this.state.error}</div>
                        :
                        <AutoForm model={model} schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                            <AutoField name="title"/>
                            <ErrorField name="title"/>

                            <LongTextField name="description"/>
                            <ErrorField name="description"/>

                            <input type="checkbox" checked={this.state.checked} onChange={this.handleClick}/>Changes the status of the Account?

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
