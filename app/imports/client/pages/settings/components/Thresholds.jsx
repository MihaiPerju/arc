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
export default class Thresholds extends Component {
  constructor() {
    super();
    this.state = {
      isDisabled: false,
      isLoading: true,
      model: {}
    };
  }

  submit = () => {
    this.refs.form.onSubmit();
  };

  componentDidMount() {
    Meteor.call("managerSettings.get", pages.THRESHOLDS, (err, model) => {
      if (!err) {
        this.setState({
          model
        });
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isLoading: false });
    });
  }

  onSubmit = data => {
    data.name = pages.THRESHOLDS;
    Meteor.call("managerSettings.update", data, err => {
      if (!err) {
        Notifier.success("Settings Updated!");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { isDisabled, isLoading, model } = this.state;

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
              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
                    labelHidden={true}
                    placeholder="Satisfactory"
                    label="Satisfactory"
                    name="satisfactory"
                    options={[
                      { value: 75, label: "75%" },
                      { value: 80, label: "80%" },
                      { value: 85, label: "85%" },
                      { value: 90, label: "90%" },
                      { value: 95, label: "95%" }
                    ]}
                  />
                  <ErrorField name="satisfactory" />
                </div>
              </div>
              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
                    labelHidden={true}
                    placeholder="Unsatisfactory"
                    label="Unsatisfactory"
                    name="unsatisfactory"
                    options={[
                      { value: 10, label: "10%" },
                      { value: 15, label: "15%" },
                      { value: 20, label: "20%" },
                      { value: 25, label: "25%" }
                    ]}
                  />
                  <ErrorField name="unsatisfactory" />
                </div>
              </div>
              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
                    labelHidden={true}
                    placeholder="Acceptance Ratio"
                    label="Acceptance Ratio"
                    name="acceptanceRatio"
                    options={[
                      { value: 40, label: "40%" },
                      { value: 45, label: "45%" },
                      { value: 50, label: "50%" },
                      { value: 55, label: "55%" }
                    ]}
                  />
                  <ErrorField name="acceptanceRatio" />
                </div>
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  satisfactory: {
    type: Number
  },
  unsatisfactory: {
    type: Number
  },
  acceptanceRatio: {
    type: Number
  }
});
