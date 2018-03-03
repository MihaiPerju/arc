import React from 'react';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import Notifier from '/imports/client/lib/Notifier';
import ROLES from '/imports/api/users/enums/roles';
import {Container, Button, Divider, Icon, Segment, Header} from 'semantic-ui-react';
import {createContainer} from 'meteor/react-meteor-data';

export class Login extends React.Component {
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
            } else {
                this.setState({error: err.reason});
            }
        });
    };

    render() {
        const {error} = this.state;

        return (
            <div className="login-section">
                <div className="login-section__wrapper">
                    <div className="logo">
                        <img src="/assets/img/logo.png" alt=""/>
                    </div>
                    <div className="login-form">
                        <AutoForm schema={LoginSchema} onSubmit={this.onSubmit}>
                            <div className="form-wrapper i-email">
                                <AutoField placeholder="Enter your email address"
                                           label={false} name="email"/>
                                <ErrorField name="email"/>
                            </div>
                            <div className="form-wrapper i-password">
                                <AutoField placeholder="Password" label={false}
                                           name="password" type="password"/>
                                <ErrorField name="password"/>
                            </div>
                            <button className="btn-login" type="submit">Login</button>
                        </AutoForm>
                        {error && <div className="alert-message">{error}</div>}
                    </div>
                </div>
            </div>
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

Login.propTypes = {
    user: React.PropTypes.object,
    loggingIn: React.PropTypes.bool
};
Login.defaultProps = {};

export default LoginContainer = createContainer(() => {
    const user = Meteor.user();
    const loggingIn = Meteor.loggingIn();

    if (!loggingIn && user) {
        FlowRouter.go('/home');
    }

    return {
        user: user,
        loggingIn: loggingIn
    }

}, Login);
