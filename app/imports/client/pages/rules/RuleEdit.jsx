import React from "react";
import RuleSchema from "/imports/api/rules/schemas/schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  HiddenField
} from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RuleGenerator from "./components/RuleGenerator";
import triggerTypes, {
  triggerOptions
} from "/imports/api/rules/enums/triggers";
import fieldsOptions from "/imports/api/rules/enums/accountFields";
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";

export default class RuleEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      clientOptions: [],
      facilityOptions: [],
      triggerType: null,
      userOptions: [],
      workQueueOptions: [],
      actionOptions: []
    };
  }

  onChange = (key, value) => {
    if (key === "triggerType") {
      this.setState({ triggerType: value });
    }
  };

  componentDidMount() {
    let { state } = this;
    let clientId = FlowRouter._current.params.clientId;

    //Setting the trigger type
    const { rule } = this.props;
    if (rule.triggerType) {
      _.extend(state, { triggerType: rule.triggerType });
    }

    Meteor.call("rule.getFilterOptions", clientId, (err, options) => {
      if (!err) {
        _.extend(state, options);
        this.setState(state);
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onSubmit = data => {
    Meteor.call("rule.update", data, err => {
      if (!err) {
        Notifier.success("Rule Updated");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onEditRule = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { rule } = this.props;
    const {
      facilityOptions,
      triggerType,
      userOptions,
      workQueueOptions,
      actionOptions
    } = this.state;

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={this.onEditRule} className="btn--green">
              Confirm & save
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              model={rule}
              schema={RuleSchema}
              onSubmit={this.onSubmit}
              onChange={this.onChange}
              ref="form"
            >
              <div className="select-wrapper">
                <div className="select-form">
                  <HiddenField
                    name="clientId"
                    value={FlowRouter._current.params.clientId}
                  />
                </div>
              </div>

              <div className="select-wrapper">
                <div className="select-form">
                  <SelectSimple
                    labelHidden={true}
                    label="Select Facility"
                    name="facilityId"
                    options={facilityOptions}
                  />
                  <ErrorField name="facilityId" />
                </div>
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Priority"
                  name="priority"
                />
                <ErrorField name="priority" />
              </div>
              <div className="form-wrapper">
                <AutoField labelHidden={true} placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Description"
                  name="description"
                />
                <ErrorField name="description" />
              </div>

              <RuleGenerator name="rule" />
              <ErrorField name="description" />

              <div className="select-wrapper">
                <div className="select-form">
                  <AutoField
                    labelHidden={true}
                    options={triggerOptions}
                    placeholder="Select a Type of Update"
                    name="triggerType"
                  />
                  <ErrorField name="triggerType" />
                </div>
              </div>

              {triggerType === triggerTypes.ACTION && (
                <div className="select-wrapper">
                  <div className="select-form">
                    <SelectSimple
                      labelHidden={true}
                      placeholder="Select Action"
                      options={actionOptions}
                      name="actionId"
                    />
                    <ErrorField name="actionId" />
                  </div>
                </div>
              )}

              {triggerType === triggerTypes.ASSIGN_USER && (
                <div className="select-wrapper">
                  <div className="select-form">
                    <SelectSimple
                      labelHidden={true}
                      placeholder="Select User"
                      name="assigneeId"
                      options={userOptions}
                    />
                    <ErrorField name="assigneeId" />
                  </div>
                </div>
              )}

              {triggerType === triggerTypes.ASSIGN_WORK_QUEUE && (
                <div className="select-wrapper">
                  <div className="select-form">
                    <SelectSimple
                      labelHidden={true}
                      placeholder="Select Work Queue"
                      options={workQueueOptions}
                      name="workQueueId"
                    />
                    <ErrorField name="workQueueId" />
                  </div>
                </div>
              )}

              {triggerType === triggerTypes.EDIT && (
                <div>
                  <div className="select-wrapper">
                    <div className="select-form">
                      <AutoField
                        options={fieldsOptions}
                        labelHidden={true}
                        placeholder="Select Field"
                        name="editField"
                      />
                      <ErrorField name="editField" />
                    </div>
                  </div>
                  <div className="select-wrapper">
                    <div className="select-form">
                      <AutoField
                        labelHidden={true}
                        placeholder="New Value"
                        name="editValue"
                      />
                      <ErrorField name="editValue" />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-wrapper">
                <AutoField
                  label="Stop execution if this condition is true"
                  name="isBreakingLoop"
                />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
