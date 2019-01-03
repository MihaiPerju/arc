import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import WorkQueuesSchema from "/imports/api/workQueues/schemas/schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  HiddenField
} from "/imports/ui/forms";

export default class WorkQueueCreate extends Component {
  constructor() {
    super();

    this.state = { isDisabled: false };
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
    const { isDisabled } = this.state;
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
              <HiddenField name="clientId" value={clientId} />
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
