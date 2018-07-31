import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import ModuleTagsSchema from "/imports/api/moduleTags/schema";
import {
  AutoForm,
  AutoField,
  ErrorField
} from "/imports/ui/forms";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import moduleListEnum from "./enums/moduleList";

export default class ModuleTagCreate extends Component {
  constructor() {
    super();

    this.state = {};
  }

  onSubmit(data) {
    Meteor.call("moduleTag.create", data, err => {
      if (!err) {
        Notifier.success("Tag added!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onCreateTag = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  getOptions = () => {
    return _.map(moduleListEnum, moduleName => ({
      value: moduleName,
      label: moduleName
    }));
  };

  render() {
    const options = this.getOptions();

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={this.onCreateTag} className="btn--green">
              Confirm & save
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              schema={ModuleTagsSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              <div className="form-wrapper">
                <AutoField labelHidden={true} placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>

              <div className="select-group">
                <div className="form-wrapper">
                  <SelectMulti
                    className="form-select__multi select-tag__multi"
                    placeholder="Select modules"
                    labelHidden={true}
                    name="moduleNames"
                    options={options}
                  />
                  <ErrorField name="moduleNames" />
                </div>
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
