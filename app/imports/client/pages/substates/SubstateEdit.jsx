import React, { Component } from "react";
import SubstateSchema from "/imports/api/substates/schemas/schema";
import Notifier from "/imports/client/lib/Notifier";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField,
  LongTextField
} from "/imports/ui/forms";
import { StateList } from "/imports/api/accounts/enums/states";

export default class EditSubstate extends Component {
  constructor() {
    super();
    this.state = { isDisabled: false };
  }

  getStates = stateList => {
    return stateList.map((state, key) => ({ value: state, label: state }));
  };

  onSubmit = data => {
    const { _id, profile } = Meteor.user();
    const updatedBy = {
      id: _id,
      name: `${profile.firstName} ${profile.lastName}`
    };

    this.setState({ isDisabled: true });
    data = Object.assign(data, { updatedBy });

    Meteor.call("substate.update", data, err => {
      if (!err) {
        Notifier.success("Substate updated");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  onCreate = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { model } = this.props;
    const { isDisabled } = this.state;
    const states = this.getStates(StateList);

    return (
      <div className="create-form letter-template-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onCreate}
              className="btn--green"
            >
              Confirm & save {isDisabled && <i className="icon-cog" />}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              model={model}
              schema={SubstateSchema}
              onSubmit={this.onSubmit}
              ref="form"
            >
              <div className="select-group">
                <div className="form-wrapper">
                  <SelectField
                    labelHidden={true}
                    name="stateName"
                    placeholder="State"
                    options={states}
                  />
                  <ErrorField name="stateName" />
                </div>
              </div>
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  type="text"
                  placeholder="Substate name"
                  name="name"
                />
                <ErrorField name="name" />
              </div>
              <div className="form-wrapper">
                <LongTextField
                  labelHidden={true}
                  type="text"
                  placeholder="Description"
                  name="description"
                />
                <ErrorField name="description" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
