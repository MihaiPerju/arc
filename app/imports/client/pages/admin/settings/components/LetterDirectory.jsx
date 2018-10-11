import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import pages from "/imports/api/settings/enums/settings";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class Root extends Component {
  constructor() {
    super();
    this.state = {
      isDisabled: false,
      isLoading: true,
      model: {}
    };
  }

  componentDidMount() {
    Meteor.call("settings.get", pages.LETTERS_DIRECTORY, (err, model) => {
      if (!err) {
        this.setState({ model });
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isLoading: false });
    });
  }

  submit = () => {
    this.refs.form.onSubmit();
  };

  onSubmit = data => {
    data.name = pages.ROOT;
    Meteor.call("settings.update", data, err => {
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
              ref="form"
              className="settings-form"
              schema={schema}
            >
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  name="letterDirectory"
                  placeholder="Root Directory"
                />
                <ErrorField name="letterDirectory" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  letterDirectory: {
    type: String
  }
});
