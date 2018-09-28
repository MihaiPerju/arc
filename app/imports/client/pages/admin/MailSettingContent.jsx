import React, { Component } from 'react';
import { AutoForm, AutoField, SelectField, ErrorField } from '/imports/ui/forms';
import Notifier from '/imports/client/lib/Notifier';
import SimpleSchema from 'simpl-schema';

export default class MailSettingContent extends Component {
  constructor () {
    super ();
    this.state = {
      model: {},
      additionField: false,
      authValue: ""
    };
  }

  componentWillMount () {
    Meteor.call ('admin.getMailSetting', (err, model) => {
      if (!err) {
        this.setState ({model});
        this.setState({ authValue: this.state.model.mailSetting.authentication });
      } else {
        Notifier.error (err.reason);
      }
    });
  }

  closePanel = () => {
    const { closePanel } = this.props;
    closePanel();
  }

  submitMailSetting = () => {
    const { mailSettingForm } = this.refs;
    mailSettingForm.submit();
  };

  onSubmitMailSetting = data => {
    Meteor.call("admin.mailSettingUpdate", data, (err) => {
      if (!err) {
        Notifier.success("Mail Setting Updated !");
      } else {
        Notifier.error(err.reason);
      }
    });
  };


  onHandleChange = (field, value) => {
    if (field == "mailSetting.authentication") {
      if(value == 'Authentication Account'){
        this.setState({ additionField: true, authValue: value })
       } else {
        this.setState({ additionField: false, authValue: value });
       }
    }
  };

  render () {
    const { isDisabled } = this.props; 
    const { model, additionField, authValue } = this.state; 
    return (
 
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.closePanel} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.submitMailSetting}
              className="btn--green"
            >
              {isDisabled ? <div> Loading<i className="icon-cog" /></div> : "Confirm & Save"}
            </button>
          </div>
        </div>

        <div className="create-form__wrapper">
          <div className="action-block">

            <AutoForm className="settings-form" onChange={this.onHandleChange} model={model} onSubmit={this.onSubmitMailSetting.bind(this)} schema={schema} ref="mailSettingForm">
              <div className="form-wrapper">
                <AutoField
                  name="mailSetting.serverAddress"
                  placeholder="Server Address"
                />
                <ErrorField name="mailSetting.serverAddress" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  name="mailSetting.port"
                  placeholder="Port"
                />
                <ErrorField name="mailSetting.port" />
              </div>

              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
                    placeholder = "SSL"
                    label="SSL"
                    name="mailSetting.ssl"
                    options={[
                      { value: true, label: "True" },
                      { value: false, label: "False" }
                    ]}
                  />
                  <ErrorField name="mailSetting.ssl" />
                </div>
              </div>

              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
                    placeholder = "Authentication"
                    label="Authentication"
                    name="mailSetting.authentication"
                    allowedValues={["Authentication Account", "Anonymous Account"]}
                  />
                  <ErrorField name="mailSetting.authentication" />
                </div>
              </div>

            { ( additionField || authValue == 'Authentication Account' ) && 
            <div>
              <div className="form-wrapper">
                <AutoField
                  name="mailSetting.username"
                  placeholder="Username"
                />
                <ErrorField name="mailSetting.username" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  name="mailSetting.password"
                  placeholder="Password"
                  type="password"
                />
                <ErrorField name="mailSetting.password" />
              </div>
              </div>
            }

            </AutoForm>
          </div>
        </div>

      </div>  
    );
  }
}

const schema = new SimpleSchema({
  mailSetting: { type: Object },
  "mailSetting.serverAddress": {
    type: String,
    required: true,
  },
  "mailSetting.ssl": {
    type: String,
    required: true,
  },
  "mailSetting.port": {
    type: String,
    required: true,
  },
  "mailSetting.authentication": {
    type: String,
    required: true,
  },
  "mailSetting.username": {
    type: String,
    optional: true,
  },
  "mailSetting.password": {
  type: String,
  optional: true,
  },
});