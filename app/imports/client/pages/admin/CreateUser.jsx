import React, { Component } from "react";
import Notifier from "../../lib/Notifier";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";

export default class CreateUser extends Component {
  constructor() {
    super();
    this.state = { isDisabled: false };
  }

  onSubmit = data => {
    this.setState({ isDisabled: true });
    Meteor.call("admin.createUser", data, (err) => {
      if (!err) {
        Notifier.success("User created !");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  onCreateUser = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { isDisabled } = this.state;

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onCreateUser}
              className="btn--green"
            >
               {isDisabled?<div> Loading<i className="icon-cog"/></div>:"Confirm & Save"}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">User information</div>
            </div>

            <AutoForm
              schema={RegisterSchema}
              onSubmit={this.onSubmit}
              ref="form"
            >
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              <div className="form-wrapper">
                <AutoField
                  // 
                  placeholder="First name"
                  name="firstName"
                />
                <ErrorField name="firstName" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  // 
                  placeholder="Last name"
                  name="lastName"
                />
                <ErrorField name="lastName" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  // 
                  placeholder="Email"
                  name="email"
                />
                <ErrorField name="email" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  // 
                  placeholder="Phone Number"
                  name="phoneNumber"
                />
                <ErrorField name="phoneNumber" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  type="password"
                  name="password"
                  // 
                  placeholder="Password"
                />
                <ErrorField name="password" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  type="password"
                  // 
                  name="confirm_password"
                  placeholder="Confirm Password"
                />
                <ErrorField name="confirm_password" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}

const RegisterSchema = new SimpleSchema({
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  password: { type: String },
  confirm_password: {
    type: String,
    custom() {
      if (this.value != this.field("password").value) {
        return "passwordMismatch";
      }
    }
  },
  phoneNumber: {
    type: String,
    optional: true
  }
});
