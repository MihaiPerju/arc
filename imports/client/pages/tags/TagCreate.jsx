import React, {Component} from 'react';
import Notifier from "../../lib/Notifier";
import TagsSchema from "/imports/api/tags/schemas/schema";
import {AutoForm, AutoField, ErrorField, SelectField} from '/imports/ui/forms';

export default class TagCreate extends Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('tag.create', data, (err) => {
            if (!err) {
                Notifier.success('Tag added!');
                this.onClose();
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    onCreateTag = () => {
        const {form} = this.refs;
        form.submit();
    };

    onClose = () => {
        const {close} = this.props;
        close();
    };

    getOptions = (enums) => {
        return _.map(enums, (value, key) => {
            return {value: value._id, label: value.clientName};
        })
    };

    render() {
        const {clients} = this.props;
        const clientOptns = this.getOptions(clients);
        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add Tag</button>
                    <div className="btn-group">
                        <button onClick={this.onClose} className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreateTag} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block i--block">
                        <AutoForm schema={TagsSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Name" name="name"/>
                                <ErrorField name="name"/>
                            </div>

                            <div className="select-group">
                                <div className="form-wrapper">
                                    <SelectField placeholder="Select Client"
                                                labelHidden={true}
                                                options={clientOptns}
                                                name="client"/>
                                    <ErrorField name="client"/>
                                </div>
                            </div>
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}