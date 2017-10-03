import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-unstyled';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

class CreateUser extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('admin.createUser', data, (err, userId) => {
            if (!err) {
                Notifier.success('User created !');
                FlowRouter.go('/admin/user/list');
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    render() {
        return (
            <AutoForm schema={RegisterSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                {this.state.error
                    ? <div className="error">{this.state.error}</div>
                    : ''
                }

                <AutoField name="firstName"/>
                <ErrorField name="firstName"/>

                <AutoField name="lastName"/>
                <ErrorField name="lastName"/>

                <AutoField name="email"/>
                <ErrorField name="email"/>

                <AutoField name="password" type="password"/>
                <ErrorField name="password"/>

                <AutoField name="confirm_password" type="password"/>
                <ErrorField name="confirm_password"/>

                <button type="submit">
                    Register
                </button>
            </AutoForm>
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
    }
});

export default CreateUser;