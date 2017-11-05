import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import {Container, Button, Divider} from 'semantic-ui-react'

class Register extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit = (data) => {
        const {firstName, lastName, email, password} = data;

        Accounts.createUser({
            email,
            password,
            profile: {firstName, lastName}
        }, (err) => {
            if (!err) {
                Notifier.success('Welcome !');
                FlowRouter.go('profile');
            } else {
                this.setState({
                    error: err.reason
                })
            }
        })
    };

    render() {
        const {error} = this.state;
        return (
            <Container>
                <AutoForm schema={RegisterSchema} onSubmit={this.onSubmit}>
                    {error && <div className="error">{error}</div>}

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

                    <Divider/>

                    <Button fluid primary type="submit">
                        Register
                    </Button>
                </AutoForm>
            </Container>
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

export default Register;