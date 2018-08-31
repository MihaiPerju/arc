import React, { Component } from "react";
import Notifier from "../../lib/Notifier";
import CodeEnum from "../../../api/codes/enums/codes";
import CodesSchema from "../../../api/codes/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";

export default class CodeCreate extends Component {
  constructor() {
    super();

    this.state = {
      isDisabled: false
    };
  }

  onSubmit(data) {
    this.setState({ isDisabled: true });
    Meteor.call("code.create", data, err => {
      if (!err) {
        Notifier.success("Code added!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  }

  onCreateCode = () => {
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
              onClick={this.onCreateCode}
              className="btn--green"
            >
               {isDisabled?<div> Loading<i className="icon-cog"/></div>:"Confirm & Save"}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              schema={CodesSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              <div className="form-wrapper">
                <AutoField labelhidden={true} placeholder="Code" name="code" />
                <ErrorField name="code" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  placeholder="Action"
                  name="action"
                />
                <ErrorField name="action" />
              </div>

              <div className="select-group">
                <div className="form-wrapper">
                  <AutoField
                    labelhidden={true}
                    name="type"
                    initialValue={CodeEnum.CARC}
                  />
                  <ErrorField name="type" />
                </div>
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  placeholder="Description"
                  name="description"
                />
                <ErrorField name="description" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  placeholder="Description short"
                  name="description_short"
                />
                <ErrorField name="description_short" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  placeholder="Denial Action"
                  name="denial_action"
                />
                <ErrorField name="denial_action" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
