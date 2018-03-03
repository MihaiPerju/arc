import React, {Component} from 'react';
import Notifier from "../../lib/Notifier";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import ClientSchema from "../../../api/clients/schemas/schema";

export default class CreateUser extends Component {
    constructor() {
        super();
        this.state = {};
    }

    onSubmit = (data) => {
        Meteor.call('admin.createUser', data, (err, userId) => {
            if (!err) {
                Notifier.success('User created !');
            } else {
                Notifier.error(err.reason);
            }
        });
    };

    onCreateUser = () => {
        const {form} = this.refs;
        form.submit();
    };

    render() {
        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add user</button>
                    <div className="btn-group">
                        <button className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreateUser} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block">
                        <div className="header__block">
                            <div className="title-block text-uppercase">User information</div>
                        </div>

                        <AutoForm schema={RegisterSchema} onSubmit={this.onSubmit} ref="form">
                            {
                                this.state.error && <div className="error">{this.state.error}</div>
                            }
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="First name" name="firstName"/>
                                <ErrorField name="firstName"/>
                            </div>
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Last name" name="lastName"/>
                                <ErrorField name="lastName"/>
                            </div>
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Email" name="email"/>
                                <ErrorField name="email"/>
                            </div>
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Phone Number" name="phoneNumber"/>
                                <ErrorField name="phoneNumber"/>
                            </div>
                            <div className="form-wrapper">
                                <AutoField type="password"
                                           name="password"
                                           labelHidden={true}
                                           placeholder="Password"
                                />
                                <ErrorField name="password"/>
                            </div>

                            <div className="form-wrapper">
                                <AutoField type="password"
                                           labelHidden={true}
                                           name="confirm_password"
                                           placeholder="Confirm Password"
                                />
                                <ErrorField name="confirm_password"/>
                            </div>
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}

const RegisterSchema = new SimpleSchema({
    firstName: {type: String},
    lastName: {type: String},
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    password: {type: String},
    confirm_password: {
        type: String,
        custom() {
            if (this.value != this.field('password').value) {
                return 'passwordMismatch';
            }
        }
    },
    phoneNumber: {
        type: String,
        optional: true
    }
});