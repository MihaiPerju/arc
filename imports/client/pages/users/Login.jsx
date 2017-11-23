import React from 'react';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import ROLES from '/imports/api/users/enums/roles';
import {Container, Button, Divider, Icon, Segment, Header} from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';

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
            <Container textAlign="center" className="m-t-p-15">
                <Segment.Group className="p-20 column">
                    <AutoForm schema={LoginSchema} onSubmit={this.onSubmit}>
                        <Header as="h3">Welcome to ARCC</Header>
                        <Segment.Group>
                            <Segment>
                                <Icon size="large" name="user"/>
                                <AutoField className="ui input width-p90" placeholder="Enter your email address" label={false} name="email"/>
                                <ErrorField name="email"/>
                            </Segment>
                            <Segment>
                                <Icon size="large" name="lock"/>
                                <AutoField className="ui input width-p90" placeholder="Password" label={false} name="password" type="password"/>
                                <ErrorField name="password"/>
                            </Segment>
                        </Segment.Group>
                        <Divider/>

                        <Button primary fluid type="submit">
                            Login
                        </Button>
                    </AutoForm>
                    {error && <div className="ui error message">{error}</div>}
                </Segment.Group>  
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

Login.propTypes = {
    user: React.PropTypes.object,
    loggingIn: React.PropTypes.bool
};
Login.defaultProps = {};

export default LoginContainer = createContainer(() => {
  const user = Meteor.user();
  const loggingIn = Meteor.loggingIn();
  
  if (!loggingIn && user) {
    FlowRouter.go('/dashboard');
  }
  
  return {
      user: user,
      loggingIn: loggingIn
  }

}, Login);
