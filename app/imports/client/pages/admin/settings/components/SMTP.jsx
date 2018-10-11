import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import pages from "/imports/api/settings/enums/settings";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";
export default class Root extends Component {
  constructor() {
    super();
    this.state = {
      isDisabled: false,
      isLoading: true,
      model: {},
      authenticationType: "Anonymous Account"
    };
  }

  submit = () => {
    this.refs.form.onSubmit();
  };

  componentDidMount() {
    Meteor.call("settings.get", pages.SMTP, (err, model) => {
      if (!err) {
        this.setState({
          authenticationType: model && model.smtp && model.smtp.authentication,
          model
        });
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isLoading: false });
    });
  }

  onSubmit = data => {
    data.name = pages.SMTP;
    if (data.smtp && data.smtp.ssl) {
      data.smtp.ssl = eval(data.smtp.ssl);
    }

    Meteor.call("settings.update", data, err => {
      if (!err) {
        Notifier.success("Settings Updated!");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onChange = (key, value) => {
    if (key === "smtp.authentication") {
      this.setState({ authenticationType: value });
    }
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { isDisabled, authenticationType, isLoading, model } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              disabled={isDisabled}
              onClick={this.submit}
              className="btn--green"
            >
              {isDisabled ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block">
            <AutoForm
              model={model}
              onSubmit={this.onSubmit}
              onChange={this.onChange}
              ref="form"
              className="settings-form"
              schema={schema}
            >
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  name="smtp.serverAddress"
                  placeholder="Server Address"
                />
                <ErrorField name="smtp.serverAddress" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  name="smtp.port"
                  placeholder="Port"
                />
                <ErrorField name="smtp.port" />
              </div>

              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
                    labelHidden={true}
                    placeholder="SSL"
                    label="SSL"
                    name="smtp.ssl"
                    options={[
                      { value: true, label: "True" },
                      { value: false, label: "False" }
                    ]}
                  />
                  <ErrorField name="smtp.ssl" />
                </div>
              </div>

              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
                    placeholder="Authentication"
                    label="Authentication"
                    name="smtp.authentication"
                    labelHidden={true}
                    allowedValues={[
                      "Authentication Account",
                      "Anonymous Account"
                    ]}
                  />
                  <ErrorField name="smtp.authentication" />
                </div>
              </div>

              {authenticationType == "Authentication Account" && (
                <div>
                  <div className="form-wrapper">
                    <AutoField
                      labelHidden={true}
                      name="smtp.username"
                      placeholder="Username"
                    />
                    <ErrorField name="smtp.username" />
                  </div>

                  <div className="form-wrapper">
                    <AutoField
                      labelHidden={true}
                      name="smtp.password"
                      placeholder="Password"
                      type="password"
                    />
                    <ErrorField name="smtp.password" />
                  </div>
                </div>
              )}
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  smtp: { type: Object },
  "smtp.serverAddress": {
    type: String
  },
  "smtp.ssl": {
    type: String
  },
  "smtp.port": {
    type: String
  },
  "smtp.authentication": {
    type: String
  },
  "smtp.username": {
    type: String,
    optional: true
  },
  "smtp.password": {
    type: String,
    optional: true
  }
});
