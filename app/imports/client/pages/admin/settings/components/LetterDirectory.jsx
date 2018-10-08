import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import pages from "/imports/api/settings/enums/settings";

export default class Root extends Component {
  constructor() {
    super();
    this.state = {
      isDisabled: false
    };
  }

  submit = () => {
    this.refs.form.onSubmit();
  };

  onSubmit = data => {
    console.log(data);
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
              onSubmit={this.onSubmit}
              ref="form"
              className="settings-form"
              schema={schema}
            >
              <div className="form-wrapper">
                <AutoField name="rootFolder" placeholder="Root Directory" />
                <ErrorField name="rootFolder" />
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
    type: String
  }
});
