import React from 'react';
import {AutoForm, AutoField, ErrorField, LongTextField, SelectField} from '/imports/ui/forms';
import ActionSchema from '/imports/api/actions/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {LabelSubstates} from '/imports/api/tasks/enums/substates.js';
import {StatesSubstates, findStateBySubstate} from '/imports/api/tasks/enums/states.js';

export default class ActionEdit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            error: null,
            checked: false
        };
    }

    onSubmit(formData) {
        const {action} = this.props;
        Meteor.call('action.edit', action._id, formData, (err) => {
            if (!err) {
                Notifier.success('Data saved!');
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

    updateProps(props) {
        const {action} = props;
        this.setState({
            checked: !!action.substate
        })
    }

    componentWillReceiveProps(props) {
        this.updateProps(props);
    }

    componentWillMount() {
        this.updateProps(this.props);
    }

    handleClick() {
        const currentState = this.state.checked;
        this.setState({
            checked: !currentState
        })
    }

    onEditAction = () => {
        const {form} = this.refs;
        form.submit();
    };

    onSetEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {action} = this.props;
        const {checked} = this.state;
        const substates = this.getOptions(LabelSubstates);

        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Edit code</button>
                    <div className="btn-group">
                        <button onClick={this.onSetEdit} className="btn-cancel">Cancel</button>
                        <button onClick={this.onEditAction} className="btn--green">Confirm & save</button>
                    </div>
                </div>

                <div className="create-form__wrapper">
                    <div className="action-block">
                        <div className="header__block">
                            <div className="title-block text-uppercase">Action information</div>
                        </div>

                        <AutoForm model={action} schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                            {
                                this.state.error
                                &&
                                <div className="error">{this.state.error}</div>
                            }
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Title" name="title"/>
                                <ErrorField name="title"/>
                            </div>

                            <div className="form-wrapper">
                                <LongTextField labelHidden={true} placeholder="Description" name="description"/>
                                <ErrorField name="description"/>
                            </div>

                            <div className="check-group">
                                <input checked={checked} type="checkbox"/>
                                <label onClick={this.handleClick}> Changes the substate of the Account?</label>
                            </div>

                            {checked &&
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <SelectField placeholder="Substate"
                                                 labelHidden={true}
                                                 options={substates}
                                                 name="substate"/>
                                    <ErrorField name="substate"/>
                                </div>
                            </div>
                            }
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}
