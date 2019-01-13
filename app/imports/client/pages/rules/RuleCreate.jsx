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
import Loading from "/imports/client/lib/ui/Loading";

export default class RuleCreate extends React.Component {
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
 
  componentWillMount() {
    this.getPriority();
  }

  componentDidMount() {
    let { state } = this;
    let clientId = FlowRouter._current.params.clientId;

    Meteor.call("rule.getFilterOptions", clientId, (err, options) => {
      if (!err) {
        _.extend(state, options);
        this.setState(state);
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onChange = (key, value) => {
    let { model } = this.state;
    model[key] = value;
    if (key === "triggerType") {
      this.setState({ triggerType: value });
    }
  };

  getPriority = () => {
    let clientId = FlowRouter._current.params.clientId;

    let filters = { clientId };
    Meteor.call("rule.getPrior", filters, (err, rule) => {
      if (!err) {
        let priority = rule ? rule.priority + 1 : 1;
        this.setState({ model: { priority } });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onSubmit = data => {
    const { close } = this.props;
    Meteor.call("rule.create", data, err => {
      if (!err) {
        Notifier.success("Rule added!");
        close();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onCreateRule = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const {
      clientOptions,
      facilityOptions,
      model,
      triggerType,
      userOptions,
      workQueueOptions,
      actionOptions
    } = this.state;

    if (!model) {
      return <Loading />;
    }

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={this.onCreateRule} className="btn--green">
              Confirm & save
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              model={model}
              onChange={this.onChange}
              schema={RuleSchema}
              onSubmit={this.onSubmit}
              ref="form"
            >
              <div className="select-wrapper">
                <div className="select-form">
                  <HiddenField
                    name="clientId"
                    value={FlowRouter._current.params.clientId}
                  />
                  <ErrorField name="clientId" />
                </div>
              </div>
              <div className="select-wrapper">
                <div className="select-form">
                  <SelectSimple
                    labelHidden={true}
                    placeholder="Select Facility"
                    name="facilityId"
                    options={facilityOptions}
                  />
                  <ErrorField name="facilityId" />
                </div>
              </div>

              {model.clientId && (
                <div className="form-wrapper">
                  <AutoField
                    value={model.priority}
                    labelHidden={true}
                    placeholder="Priority"
                    name="priority"
                  />
                  <ErrorField name="priority" />
                </div>
              )}

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
              <ErrorField name="rule" />

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
