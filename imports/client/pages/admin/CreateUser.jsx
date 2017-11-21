import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

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
            <Container className="page-container">
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
                    
                    <AutoField name="phoneNumber"/>
                    <ErrorField name="phoneNumber"/>

                    <AutoField name="password" type="password"/>
                    <ErrorField name="password"/>

                    <AutoField name="confirm_password" type="password"/>
                    <ErrorField name="confirm_password"/>

                    <Divider/>

                    <Button primary fluid type="submit">
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
    },
    phoneNumber: {
        type: String, 
        optional: true
    }
});

export default CreateUser;