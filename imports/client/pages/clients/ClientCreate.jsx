import React, {Component} from 'react';
import Notifier from "../../lib/Notifier";
import ClientSchema from "../../../api/clients/schemas/schema";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';

export default class CreateClient extends Component {
    constructor() {
        super();
        this.state = {
            newContact: false
        }
    }

    onSubmit(data) {
        Meteor.call('client.create', data, (err) => {
            if (!err) {
                Notifier.success('Client added!');
                this.onClose();
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    onCreateClient = () => {
        const {form} = this.refs;
        form.submit();
    };

    onClose = () => {
        const {close} = this.props;
        close();
    };

    render() {
        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add client</button>
                    <div className="btn-group">
                        <button onClick={this.onClose} className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreateClient} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block">
                        <div className="header__block">
                            <div className="title-block text-uppercase">Client information</div>
                        </div>
                        <AutoForm schema={ClientSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                            {
                                this.state.error && <div className="error">{this.state.error}</div>
                            }
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Client name" name="clientName"/>
                                <ErrorField name="clientName"/>
                            </div>

                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Email" name="email"/>
                                <ErrorField name="email"/>
                            </div>
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}

class NewContact extends Component {
    render() {
        const {close} = this.props;

        return (
            <div className="action-block action-new-contact">
                <div className="header__block">
                    <div className="title-block text-uppercase">Contact information</div>
                </div>
                <div className="row__action">
                    <div className="type">Contact nr. 1</div>
                    <div className="btn-delete" onClick={close}>Delete</div>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Client name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="First name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="select-group">
                    <div className="form-wrapper">
                        <select name="filter">
                            <option value="">Contact Description</option>
                        </select>
                    </div>
                </div>
                <div className="form-wrapper">
                    <textarea placeholder="*Note"></textarea>
                </div>
            </div>
        )
    }
}