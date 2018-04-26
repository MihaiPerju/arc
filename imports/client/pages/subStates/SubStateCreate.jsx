import React, { Component } from 'react';
import SubStateSchema from '/imports/api/subStates/schemas/schema';
import { AutoForm, AutoField, ErrorField, SelectField } from '/imports/ui/forms';
import Notifier from '/imports/client/lib/Notifier';
import { StateList } from '/imports/api/tasks/enums/states';

export default class SubStateCreate extends Component {
    constructor() {
        super();
        this.state = {};
    }

    onSubmit = (data) => {
        Meteor.call('subState.create', data, (err) => {
            if (!err) {
                Notifier.success('Sub state added!');
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
                    <button className="btn-add">+ Add Sub state</button>
                    <div className="btn-group">
                        <button onClick={this.onClose} className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreate} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block i--block">
                        <AutoForm schema={SubStateSchema} onSubmit={this.onSubmit} ref="form">
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
                                <AutoField labelHidden={true} type="text" placeholder="Sub state name" name="name" />
                                <ErrorField name="name" />
                            </div>
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}
