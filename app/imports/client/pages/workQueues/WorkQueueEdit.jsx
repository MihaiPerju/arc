import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import WorkQueuesSchema from "/imports/api/workQueues/schemas/schema";
import Notifier from "/imports/client/lib/Notifier";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import moduleListEnum, {
  moduleNames
} from "/imports/api/workQueues/enums/workQueues";

export default class WorkQueueEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      isDisabled: false,
      clientOptions: []
    };
  }

  componentDidMount() {
    Meteor.call("clients.get", (err, clients) => {
      if (!err) {
        const clientOptions = clients.map(client => {
          return { label: client.clientName, value: client._id };
        });
        this.setState({ clientOptions });
      } else {
        Notifier.error(err.reason);
      }
    });
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

  getOptions = () => {
    return _.map(moduleListEnum, entities => ({
      value: entities,
      label: entities
    }));
  };

  render() {
    const { workQueue } = this.props;
    const { isDisabled, clientOptions } = this.state;
    const options = this.getOptions();

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

              <div className="select-group">
                <div className="form-wrapper">
                  <SelectMulti
                    className="form-select__multi select-tag__multi"
                    placeholder="Select modules"
                    labelHidden={true}
                    name="entities"
                    options={options}
                  />
                  <ErrorField name="entities" />
                </div>
              </div>

              {workQueue &&
                workQueue.entities &&
                workQueue.entities.includes(moduleNames.WORK_QUEUE) && (
                  <div className="select-group">
                    <div className="form-wrapper">
                      <SelectField
                        placeholder="Select Client"
                        labelHidden={true}
                        options={clientOptions}
                        name="clientId"
                      />
                      <ErrorField name="clientId" />
                    </div>
                  </div>
                )}
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
