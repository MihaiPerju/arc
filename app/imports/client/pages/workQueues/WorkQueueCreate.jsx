import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import WorkQueuesSchema from "/imports/api/workQueues/schemas/schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  HiddenField
} from "/imports/ui/forms";
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";

export default class WorkQueueCreate extends Component {
  constructor() {
    super();

    this.state = { isDisabled: false, facilityOptions: [] };
  }

  componentWillMount() {
    let clientId = FlowRouter._current.params.clientId;
    Meteor.call("facilities.getNames", { clientId }, (err, facilities) => {
      if (!err) {
        let facilityOptions = facilities.map(facility => {
          return { value: facility._id, label: facility.name };
        });
        this.setState({ facilityOptions });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onSubmit(data) {
    this.setState({ isDisabled: true });
    Meteor.call("workQueue.create", { data }, err => {
      if (!err) {
        Notifier.success("Work Queue Created!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  }

  onCreateWorkQueue = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { isDisabled, facilityOptions } = this.state;
    const clientId = FlowRouter.current().params.clientId;
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
              onClick={this.onCreateWorkQueue}
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
              schema={WorkQueuesSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              <div className="form-wrapper">
                <AutoField labelHidden={true} placeholder="Name" name="name" />
                <ErrorField name="name" />
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
              <HiddenField name="clientId" value={clientId} />
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
