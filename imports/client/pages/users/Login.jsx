import React from 'react';
import SimpleSchema from 'simpl-schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import ROLES from '/imports/api/users/enums/roles';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null
        }
    }

    onSubmit = (data) => {
        const {email, password} = data;

        Meteor.loginWithPassword(email, password, (err) => {
            if (!err) {
                Notifier.success('Welcome back !');
                FlowRouter.go('profile');
            } else {
                this.setState({error: err.reason});
            }
        });
    };

    render() {
        const {error} = this.state;

        return (
            <Container textAlign="center">
                <AutoForm schema={LoginSchema} onSubmit={this.onSubmit}>
                    {
                        error && <div className="error">{error}</div>
                    }
                    <AutoField name="email"/>
                    <ErrorField name="email"/>

                    <AutoField name="password" type="password"/>
                    <ErrorField name="password"/>

                    <Divider/>

                    <Button primary fluid type="submit">
                        Login
                    </Button>

                </AutoForm>
            </Container>
        )
    }
}

const LoginSchema = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    password: {type: String}
});

export default Login;