import React from "react";
import RuleSchema from "/imports/api/rules/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RuleGenerator from "./components/RuleGenerator";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";
import facilityQuery from "/imports/api/facilities/queries/facilityList";
import { SelectField } from "/imports/ui/forms";
import PrioritySelect from "./components/PrioritySelect";
export default class RuleCreate extends React.Component {
  constructor() {
    super();

    this.state = {
      clientOptions: [],
      facilityOptions: [],
      clientId: null,
      model: {}
    };
  }

  onChange = (key, value) => {
    if (key === "clientId") {
      let facilityOptions = [{ label: "All", value: "all" }];
      let clientId = value;
      this.setState({ clientId, model: { priority: 1 } });
      facilityQuery.clone({ filters: { clientId } }).fetch((err, res) => {
        if (!err) {
          res.map(facility => {
            facilityOptions.push({ label: facility.name, value: facility._id });
          });
          this.setState({ facilityOptions });
        }
      });
    }
  };

  onChangePriority = priority => {
    this.setState({ model: { priority } });
  };

  componentWillMount() {
    let clientOptions = [];
    let facilityOptions = [{ label: "All", value: "all" }];
    clientsQuery.fetch((err, res) => {
      if (!err) {
        res.map(client => {
          clientOptions.push({ label: client.clientName, value: client._id });
        });
        this.setState({ clientOptions });
      }
    });
    facilityQuery.fetch((err, res) => {
      if (!err) {
        res.map(facility => {
          facilityOptions.push({ label: facility.name, value: facility._id });
        });
        this.setState({ facilityOptions });
      }
    });
  }

  onSubmit = data => {
    Meteor.call("rule.create", data, (err, res) => {
      if (!err) {
        Notifier.success("Rule added!");
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
    const { clientOptions, facilityOptions, model, clientId } = this.state;
    console.log(model);
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
                  <SelectField
                    labelHidden={true}
                    label="Select Client"
                    name="clientId"
                    options={clientOptions}
                  />
                  <ErrorField name="clientId" />
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

              <PrioritySelect
                clientId={clientId}
                setPriority={this.onChangePriority}
              />

              {clientId && (
                <div className="form-wrapper">
                  <AutoField
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
