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
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";
import inputTypesEnum from "/imports/api/actions/enums/inputTypeEnum";
import requirementTypes from "/imports/api/actions/enums/requirementEnum";

export default class ActionCreate extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      isDisabled: false
    };
  }

  onSubmit(data) {
    const { value } = data.substateId || {};
    data.substateId = value;
    this.setState({ isDisabled: true });
    Meteor.call("action.create", data, err => {
      if (!err) {
        Notifier.success("Action created!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  }

  getOptions = enums => {
    return _.map(enums, value => {
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
    const { checked, isDisabled } = this.state;
    const requirementOptions = [
      { label: requirementTypes.OPTIONAL, value: requirementTypes.OPTIONAL },
      { label: requirementTypes.MANDATORY, value: requirementTypes.MANDATORY }
    ];

    return (
      <div className="create-form action-create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onCreateAction}
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
                    <SelectSimple
                      placeholder="Substate"
                      labelHidden={true}
                      name="substateId"
                      options={substatesOptions}
                    />
                    <ErrorField name="substateId" />
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
                        options={inputTypesEnum}
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
                    <div className="form-wrapper">
                      <SelectField
                        labelHidden={true}
                        options={requirementOptions}
                        name="requirement"
                        label="Mandatory"
                      />
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
