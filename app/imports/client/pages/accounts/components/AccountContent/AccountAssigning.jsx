import React from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";
import WorkQueueService from "./../../services/WorkQueueService";
import workQueueQuery from "/imports/api/tags/queries/listTags";
import Loading from "/imports/client/lib/ui/Loading";

export default class AccountActioning extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: true,
      assignToUser: true,
      assignToWorkQueue: false,
      workQueueOptions: [],
      loadingWorkQueues: true
    };
  }

  componentWillMount() {
    workQueueQuery.clone().fetch((err, res) => {
      if (!err) {
        const workQueueOptions = WorkQueueService.createOptions(res);
        this.setState({
          workQueueOptions,
          loadingWorkQueues: false
        });
      }
    });
  }

  closeDialog = () => {
    const { closeDialog } = this.props;
    closeDialog();
  };

  assignToUser = ({ assigneeId }) => {
    const { accountIds, uncheckAccountList } = this.props;
    Meteor.call("account.assignUser.bulk", { accountIds, assigneeId }, err => {
      if (!err) {
        Notifier.success("Account assigned to user!");
        uncheckAccountList();
        this.closeDialog();
      } else {
        Notifier.error(err.reason);
      }
    });
  };
  assignToWorkQueue = ({ workQueue }) => {
    const { accountIds, uncheckAccountList } = this.props;
    Meteor.call(
      "account.assignWorkQueue.bulk",
      { accountIds, workQueue },
      err => {
        if (!err) {
          Notifier.success("Account assigned to Work Queue!");
          uncheckAccountList();
          this.closeDialog();
        } else {
          Notifier.error(err.reason);
        }
      }
    );
  };

  showDialog = () => {
    const { model, options, assignToUser, title } = this.props;

    const {
      workQueueOptions,
      assignToWorkQueue,
      loadingWorkQueues
    } = this.state;

    if (loadingWorkQueues) {
      return <Loading />;
    }
    return (
      <div className="meta-dialog">
        <h1>Assign account:</h1>
        {assignToUser ? (
          <AutoForm //model={model}
            schema={assignSchema}
            onSubmit={this.assignToUser}
          >
            <div className="form-wrapper select-item">
              <AutoField
                labelHidden={true}
                name="assigneeId"
                options={options}
              />
              <ErrorField name="assigneeId" />
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button type="submit" className="btn--light-blue">
                Confirm
              </button>
            </div>
          </AutoForm>
        ) : (
          <AutoForm //model={model}
            schema={workQueueSchema}
            onSubmit={this.assignToWorkQueue}
          >
            <div className="form-wrapper select-item">
              <AutoField
                labelHidden={true}
                name="workQueue"
                options={workQueueOptions}
              />
              <ErrorField name="workQueue" />
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button type="submit" className="btn--light-blue">
                Confirm
              </button>
            </div>
          </AutoForm>
        )}
      </div>
    );
  };

  render() {
    const { dialogIsActive } = this.state;
    const { type, title, closeDialog } = this.props;

    return (
      <div>
        <span>{type}</span>
        {
          <Dialog
            className="account-dialog"
            closePortal={closeDialog}
            title={title}
          >
            {this.showDialog()}
          </Dialog>
        }
      </div>
    );
  }
}

const assignSchema = new SimpleSchema({
  assigneeId: {
    type: String
  }
});

const workQueueSchema = new SimpleSchema({
  workQueue: {
    type: String
  }
});
