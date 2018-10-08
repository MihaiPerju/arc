import React, { Component } from "react";
import { AutoForm } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import SimpleSchema from "simpl-schema";
import DatePicker from "react-datepicker";
import moment from "moment";

export default class LetterSettings extends Component {
  constructor() {
    super();
    this.state = {
      model: {},
      letterCompileTime: "",
      isDisabled: false
    };
  }

  componentWillMount() {
    Meteor.call("admin.getLetterSettings", (err, model) => {
      if (!err) {
        let selectedTime =
          model && model.letterCompileTime != undefined
            ? moment(model.letterCompileTime)
            : "";
        this.setState({ model, letterCompileTime: selectedTime });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onSubmitLetterSettings = data => {
    data.letterCompileTime = this.state.letterCompileTime.toISOString();
    Meteor.call("admin.updateLetterSettings", data, err => {
      if (!err) {
        Notifier.success("Settings updated!");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  submitLetterSettings = () => {
    const { letterSettingsForm } = this.refs;
    letterSettingsForm.submit();
  };

  closePanel = () => {
    const { closePanel } = this.props;
    closePanel();
  };

  onChange = newTime => {
    this.setState({ letterCompileTime: newTime });
  };

  render() {
    const { model, isDisabled } = this.state;
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
              onClick={this.submitLetterSettings}
              className="btn--green"
            >
              {isDisabled ? (
                <div>
                  {" "}
                  Loading
                  <i className="icon-cog" />
                </div>
              ) : (
                "Confirm & Save"
              )}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block">
            <AutoForm
              className="settings-form"
              model={model}
              onSubmit={this.onSubmitLetterSettings.bind(this)}
              schema={schema}
              ref="letterSettingsForm"
            >
              <div className="settings-label">Letter Compile Time</div>
              <div className="settings-text-box">
                <DatePicker
                  selected={this.state.letterCompileTime}
                  onChange={this.onChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="LT"
                  timeCaption="Time"
                  placeholderText="Letter Compile Time"
                />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  rootFolder: {
    type: String,
    optional: true
  },
  letterCompileTime: {
    type: String,
    optional: true
  }
});
