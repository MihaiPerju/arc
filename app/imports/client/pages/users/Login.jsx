import React from "react";
import PropTypes from "prop-types";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import { createContainer } from "meteor/react-meteor-data";

export class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      isDisabled: false
    };
  }

  onSubmit = data => {
    const { email, password } = data;
    this.setState({ isDisabled: true });

    Meteor.loginWithPassword(email, password, err => {
      if (!err) {
        Notifier.success("Welcome back !");
      } else {
        this.setState({ error: err.reason });
      }
      this.setState({ isDisabled: false });
    });
  };

  render() {
    const { error, isDisabled } = this.state;

    return (
      <div className="login-section">
        <div className="login-section__wrapper">
          <div className="logo">
            <img src="/assets/img/logo.png" alt="" />
          </div>
          <div className="login-form">
            <AutoForm schema={LoginSchema} onSubmit={this.onSubmit}>
              <div className="form-wrapper i-email">
                <AutoField
                  placeholder="Enter your email address"
                  label={false}
                  name="email"
                />
                <ErrorField name="email" />
              </div>
              <div className="form-wrapper i-password">
                <AutoField
                  placeholder="Password"
                  label={false}
                  name="password"
                  type="password"
                />
                <ErrorField name="password" />
              </div>
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                className="btn-login"
                type="submit"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </AutoForm>
            {error && <div className="alert-message">{error}</div>}
          </div>
        </div>
      </div>
    );
  }
}

const LoginSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  password: { type: String }
});

Login.propTypes = {
  user: PropTypes.object,
  loggingIn: PropTypes.bool
};
Login.defaultProps = {};

export default (LoginContainer = createContainer(() => {
  const user = Meteor.user();
  const loggingIn = Meteor.loggingIn();

  if (!loggingIn && user) {
    FlowRouter.go("/dashboard");
  }

  return {
    user: user,
    loggingIn: loggingIn
  };
}, Login));
