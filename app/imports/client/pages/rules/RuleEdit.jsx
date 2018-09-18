import React from "react";
import RuleSchema from "/imports/api/rules/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RuleGenerator from "./components/RuleGenerator";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";
import facilityQuery from "/imports/api/facilities/queries/facilityList";
import { SelectField } from "/imports/ui/forms";
import FacilitySelector from "/imports/api/facilities/enums/selectors";
import triggerTypes, {
  triggerOptions
} from "/imports/api/rules/enums/triggers";
import userQuery from "/imports/api/users/queries/listUsers.js";
import workQueueQuery from "/imports/api/tags/queries/listTags";
import actionQuery from "/imports/api/actions/queries/actionList";
import RolesEnum from "/imports/api/users/enums/roles";
import fieldsOptions from "/imports/api/rules/enums/accountFields";

export default class RuleEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      clientOptions: [],
      facilityOptions: [],
      model: {},
      triggerType: null,
      userOptions: [],
      workQueueOptions: [],
      actionOptions: []
    };
  }

  onChange = (key, value) => {
    if (key === "clientId") {
      let clientId = value;
      let facilityOptions = [{ label: "All", value: FacilitySelector.ALL }];
      this.setState({ model: { priority: 1, clientId } });
      facilityQuery.clone({ filters: { clientId } }).fetch((err, res) => {
        if (!err) {
          res.map(facility => {
            facilityOptions.push({ label: facility.name, value: facility._id });
          });
          this.setState({ facilityOptions });
        }
      });
    } else if (key === "triggerType") {
      this.setState({ triggerType: value });
    }
  };

  componentDidMount() {
    let userOptions = [];
    let workQueueOptions = [];
    let actionOptions = [];
    let clientOptions = [];
    let facilityOptions = [{ label: "All", value: "all" }];

    //Filling the client options
    clientsQuery.fetch((err, res) => {
      if (!err) {
        res.map(client => {
          clientOptions.push({ label: client.clientName, value: client._id });
        });
        this.setState({ clientOptions });
      }
    });

    //Filling the facility options
    facilityQuery.fetch((err, res) => {
      if (!err) {
        res.map(facility => {
          facilityOptions.push({ label: facility.name, value: facility._id });
        });
        this.setState({ facilityOptions });
      }
    });

    //Filling the user options
    userQuery
      .clone({ filters: { roles: { $in: [RolesEnum.REP] } } })
      .fetch((err, res) => {
        if (!err) {
          res.map(user => {
            userOptions.push({
              label:
                user.profile &&
                user.profile.lastName + " " + user.profile.firstName,
              value: user._id
            });
          });
          this.setState({ userOptions });
        }
      });

    //Filling the work queue options
    workQueueQuery.clone().fetch((err, res) => {
      if (!err) {
        res.map(workQueue => {
          workQueueOptions.push({
            label: workQueue.name,
            value: workQueue._id
          });
        });
        this.setState({ workQueueOptions });
      }
    });

    //Filling the action options
    actionQuery.clone().fetch((err, res) => {
      if (!err) {
        res.map(action => {
          actionOptions.push({
            label: action.title,
            value: action._id
          });
        });
        this.setState({ actionOptions });
      }
    });

    //Setting the trigger type
    const { rule } = this.props;
    if (rule.triggerType) {
      this.setState({ triggerType: rule.triggerType });
    }
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
      clientOptions,
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
                  <SelectField
                    labelHidden={true}
                    label="Select Client"
                    name="clientId"
                    options={clientOptions}
                  />
                </div>
              </div>

              <div className="select-wrapper">
                <div className="select-form">
                  <SelectField
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
                    <AutoField
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
                    <AutoField
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
                    <AutoField
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
