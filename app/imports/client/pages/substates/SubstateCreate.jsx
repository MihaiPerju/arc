import React, { Component } from 'react';
import SubstateSchema from '/imports/api/substates/schemas/schema';
import { AutoForm, AutoField, ErrorField, SelectField, LongTextField } from '/imports/ui/forms';
import Notifier from '/imports/client/lib/Notifier';
import { StateList } from '/imports/api/tasks/enums/states';

export default class SubstateCreate extends Component {
    constructor() {
        super();
        this.state = {};
    }

    onSubmit = (data) => {
        Meteor.call('substate.create', data, (err) => {
            if (!err) {
                Notifier.success('Substate added!');
                this.onClose();
            } else {
                Notifier.error(err.reason);
            }
        });
    };

    getStates = (stateList) => {
        return stateList.map((state, key) => ({ value: state, label: state }));
    };

    onCreate = () => {
        const { form } = this.refs;
        form.submit();
    };

    onClose = () => {
        const { close } = this.props;
        close();
    };

    render() {
        const states = this.getStates(StateList);

        return (
            <div className="create-form letter-template-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add Substate</button>
                    <div className="btn-group">
                        <button onClick={this.onClose} className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreate} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block i--block">
                        <AutoForm schema={SubstateSchema} onSubmit={this.onSubmit} ref="form">
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <SelectField
                                        labelHidden={true}
                                        name="stateName"
                                        placeholder="State"
                                        options={states}
                                    />
                                    <ErrorField name="stateName" />
                                </div>
                            </div>
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} type="text" placeholder="Substate name" name="name" />
                                <ErrorField name="name" />
                            </div>
                            <div className="form-wrapper">
                                <LongTextField labelHidden={true} type="text" placeholder="Description" name="description" />
                                <ErrorField name="description" />
                            </div>
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}
