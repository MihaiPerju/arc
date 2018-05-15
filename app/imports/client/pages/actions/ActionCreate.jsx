import React, { Component } from "react";
import ActionSchema from "../../../api/actions/schemas/schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  LongTextField,
  SelectField,
  ListField,
  ListItemField,
  NestField
} from "/imports/ui/forms";
import Notifier from "../../lib/Notifier";

export default class ActionCreate extends Component {
  constructor() {
    super();
    this.state = {
      checked: false
    };
  }

  onSubmit(data) {
    data.substateId = data.substate;
    Meteor.call("action.create", data, err => {
      if (!err) {
        Notifier.success("Action created!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  getOptions = enums => {
    return _.map(enums, (value, key) => {
      const label = `${value.stateName}: ${value.name}`;
      return { value: value._id, label: label };
    });
  };

  handleClick = () => {
    const { checked } = this.state;
    this.setState({
      checked: !checked
    });
  };

  onCreateAction = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { substates } = this.props;
    const substatesOptions = this.getOptions(substates);
    const { checked } = this.state;
    const inputTypes = [
      { value: "number", label: "number" },
      { value: "date", label: "date" },
      { value: "string", label: "text" }
    ];

    return (
      <div className="create-form action-create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={this.onCreateAction} className="btn--green">
              Confirm & save
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block">
            <AutoForm
              schema={ActionSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}

              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Title"
                  name="title"
                />
                <ErrorField name="title" />
              </div>

              <div className="form-wrapper">
                <LongTextField
                  labelHidden={true}
                  placeholder="Description"
                  name="description"
                />
                <ErrorField name="description" />
              </div>

              <div className="check-group">
                <input type="checkbox" id="n1" onClick={this.handleClick} />
                <label htmlFor="n1">
                  {" "}
                  Changes the substate of the Account?
                </label>
              </div>

              {checked && (
                <div className="select-group">
                  <div className="form-wrapper">
                    <SelectField
                      placeholder="Substate"
                      labelHidden={true}
                      options={substatesOptions}
                      name="substate"
                    />
                    <ErrorField name="substate" />
                  </div>
                </div>
              )}

              <ListField name="inputs" showListField={() => {}}>
                <ListItemField name="$">
                  <NestField className="upload-item text-center">
                    <div className="form-wrapper">
                      <SelectField
                        placeholder="Select type"
                        labelHidden={true}
                        options={inputTypes}
                        name="type"
                      />
                      <ErrorField name="type" />
                    </div>
                    <div className="form-wrapper">
                      <AutoField
                        labelHidden={true}
                        name="label"
                        placeholder="label"
                      />
                      <ErrorField name="label" />
                    </div>
                  </NestField>
                </ListItemField>
              </ListField>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
