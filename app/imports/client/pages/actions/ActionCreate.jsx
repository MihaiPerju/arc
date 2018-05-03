import React, {Component} from 'react';
import ActionSchema from "../../../api/actions/schemas/schema";
import {AutoForm, AutoField, ErrorField, LongTextField, SelectField} from '/imports/ui/forms';
import Notifier from "../../lib/Notifier";

export default class ActionCreate extends Component {
    constructor() {
        super();
        this.state = {
            checked: false
        };
    }

    onSubmit(data) {
        Meteor.call('action.create', data, (err) => {
            if (!err) {
                Notifier.success('Action created!');
                this.onClose();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    getOptions = (enums) => {
        return _.map(enums, (value, key) => {
            const label = `${value.stateName}: ${value.name}`;
            return {value: value.name.replace(/ /g,"_"), label: label};
        })
    };

    handleClick = () => {
        const {checked} = this.state;
        this.setState({
            checked: !checked
        })
    };

    onCreateAction = () => {
        const {form} = this.refs;
        form.submit();
    };

    onClose = () => {
        const {close} = this.props;
        close();
    };

    render() {
        const {substates} = this.props;
        const substatesOptions = this.getOptions(substates);
        const {checked} = this.state;
        return (
            <div className="create-form action-create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add action</button>
                    <div className="btn-group">
                        <button onClick={this.onClose} className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreateAction} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block">
                        <AutoForm schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                            {this.state.error && <div className="error">{this.state.error}</div>}

                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Title" name="title"/>
                                <ErrorField name="title"/>
                            </div>

                            <div className="form-wrapper">
                                <LongTextField labelHidden={true} placeholder="Description" name="description"/>
                                <ErrorField name="description"/>
                            </div>

                            <div className="check-group">
                                <input type="checkbox" id="n1" onClick={this.handleClick}/>
                                <label htmlFor="n1"> Changes the substate of the Account?</label>
                            </div>

                            {checked &&
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <SelectField placeholder="Substate"
                                                 labelHidden={true}
                                                 options={substatesOptions}
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
