import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import TagsSchema from "/imports/api/tags/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import moduleListEnum from "/imports/api/tags/enums/tags";

export default class TagCreate extends Component {
  constructor() {
    super();

    this.state = { isDisabled: false };
  }

  onSubmit(data) {
    this.setState({ isDisabled: true });
    Meteor.call("tag.create", { data }, err => {
      if (!err) {
        Notifier.success("Tag added!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
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
    return _.map(moduleListEnum, entities => ({
      value: entities,
      label: entities
    }));
  };

  render() {
    const { isDisabled } = this.state;
    const options = this.getOptions();

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
              onClick={this.onCreateTag}
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
          <div className="action-block i--block">
            <AutoForm
              schema={TagsSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              <div className="form-wrapper">
                <AutoField placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>

              <div className="select-group">
                <div className="form-wrapper">
                  <SelectMulti
                    className="form-select__multi select-tag__multi"
                    placeholder="Select modules"
                    
                    name="entities"
                    options={options}
                  />
                  <ErrorField name="entities" />
                </div>
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
