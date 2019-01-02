import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
} from "/imports/ui/forms";
import WorkQueuesSchema from "/imports/api/workQueues/schemas/schema";
import Notifier from "/imports/client/lib/Notifier";

export default class WorkQueueEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      isDisabled: false,
    };
  }
  
  onSubmit(formData) {
    const { workQueue, setEdit } = this.props;
    this.setState({ isDisabled: true });
    Meteor.call("workQueue.edit", workQueue._id, formData, err => {
      if (!err) {
        Notifier.success("Work Queue saved !");
        setEdit();
      } else {
        Notifier.error("An error occurred!");
      }
      this.setState({ isDisabled: false });
    });
  }

  onEditWorkQueue = () => {
    const { form } = this.refs;
    form.submit();
  };

  onSetEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  render() {
    const { workQueue } = this.props;
    const { isDisabled } = this.state;

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onSetEdit} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onEditWorkQueue}
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

        <div>
          <div className="action-block m-t--20">
            <div className="header__block">
              <div className="title-block text-uppercase">
                Work Queue information
              </div>
            </div>
            <AutoForm
              schema={WorkQueuesSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={workQueue}
            >
              <div className="form-wrapper">
                <AutoField labelHidden={true} placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
