import React from "react";
import RuleSchema from "/imports/api/rules/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RuleGenerator from "./components/RuleGenerator";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";
import { SelectField } from "/imports/ui/forms";

export default class RuleCreate extends React.Component {
  constructor() {
    super();

    this.state = {
      clientOptions: []
    };
  }

  componentWillMount() {
    let clientOptions = [];
    clientsQuery.fetch((err, res) => {
      if (!err) {
        res.map(client => {
          clientOptions.push({ label: client.clientName, value: client._id });
        });
        this.setState({ clientOptions });
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
    const { clientOptions } = this.state;

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
            <AutoForm schema={RuleSchema} onSubmit={this.onSubmit} ref="form">
              {this.state.error && (
                <div className="error">{this.state.error}</div>
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

              <RuleGenerator name="rule" />
              <ErrorField name="rule" />
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
