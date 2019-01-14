import React from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";
import WorkQueueService from "./../../services/WorkQueueService";
import Loading from "/imports/client/lib/ui/Loading";
import PagerService from "/imports/client/lib/PagerService";
import NewAction from "./NewAction";
import ParamsService from "/imports/client/lib/ParamsService";

export default class AccountActioning extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: true,
      assignToUser: true,
      assignToWorkQueue: false,
      workQueueOptions: [],
      loadingWorkQueues: true,
      isDisabled: false,
      userOptions: false,
      loadingUserOptions: false
    };
  }

  componentWillMount() {
    const { accountIds, assignToUser, assignAction, facilitiesOption } = this.props;
    if(!this.props.bulkAssign) {
      Meteor.call("workQueues.get", { accountIds }, (err, res) => {
        if (!err) {
          const workQueueOptions = WorkQueueService.createOptions(res);
          this.setState({
            workQueueOptions,
            loadingWorkQueues: false
          });
        }
      }); 
    }

    if((assignToUser && facilitiesOption) || assignAction) {  this.setState({ loadingWorkQueues: false }); }

    this.props.bulkAssign
      ? this.setState({ userOptions: [] })
      : this.setState({ userOptions: this.props.options });
  }

  componentWillReceiveProps(newProps) {
    if(newProps.workQueueOption) {
      const workQueueOptions = WorkQueueService.createOptions(newProps.workQueueOption);
      this.setState({
        workQueueOptions: workQueueOptions,
        loadingWorkQueues: false
      });
    }
    if(newProps.assignToUser && newProps.facilitiesOption) { 
      this.setState({ loadingWorkQueues: false });
    }
  }

  closeDialog = () => {
    const { closeDialog } = this.props;
    closeDialog();
  };

  assignToUser = ({ assigneeId }) => {
    const { accountIds, uncheckAccountList, bulkAssign } = this.props;
    this.setState({ isDisabled: true });
    const params = bulkAssign ? ParamsService.getAccountParams() : false;
    Meteor.call(
      "account.assignUser.bulk",
      { accountIds, assigneeId, params },
      err => {
        if (!err) {
          Notifier.success("Account assigned to user!");
          uncheckAccountList();
          this.closeDialog();
        } else {
          Notifier.error(err.reason);
        }
        this.setState({ isDisabled: false });
      }
    );
  };
  assignToWorkQueue = ({ workQueueId }) => {
    const { accountIds, uncheckAccountList, bulkAssign } = this.props;
    this.setState({ isDisabled: true });
    const params = bulkAssign ? ParamsService.getAccountParams() : false;
    Meteor.call(
      "account.assignWorkQueue.bulk",
      { accountIds, workQueueId, params },
      err => {
        if (!err) {
          Notifier.success("Account assigned to Work Queue!");
          uncheckAccountList();
          this.closeDialog();
        } else {
          Notifier.error(err.reason);
        }
        this.setState({ isDisabled: false });
      }
    );
  };

  onHandleChange(field, value) {
    if (field == "facilityId") {
      this.setState({ loadingUserOptions: true });
      Meteor.call("account.facility.user", value, (err, userOptions) => {
        if (!err) {
          this.setState({ userOptions, loadingUserOptions: false });
        } else {
          this.setState({ userOptions: [] });
        }
      });
    }
  }

  showDialog = () => {
    const {
      options,
      assignToUser,
      assignAction,
      bulkAssign,
      facilitiesOption,
      assignToWorkQueue,
      accountIds
    } = this.props;

    const {
      workQueueOptions,
      loadingWorkQueues,
      isDisabled,
      userOptions,
      loadingUserOptions
    } = this.state;

    if (loadingWorkQueues) {
      return <Loading />;
    }
    return (
      <div className="meta-dialog">
        {assignAction && <h1>Bulk Action</h1>}
        {assignToUser && <h1>Assign User</h1>}
        {assignToWorkQueue && <h1>Assign Work Queue</h1>}

        {assignToUser ? (
          <AutoForm //model={model}
            schema={assignSchema}
            onSubmit={this.assignToUser}
            onChange={this.onHandleChange.bind(this)}
          >
            {bulkAssign && (
              <div className="form-wrapper select-item">
                <SelectField
                  name="facilityId"
                  // 
                  options={facilitiesOption}
                  placeholder="Select Facility"
                />
                <ErrorField name="facilityId" />
              </div>
            )}
            {loadingUserOptions ? <Loading /> :
            <div className="form-wrapper select-item">
              <SelectField
                // 
                name="assigneeId"
                placeholder="Select Users"
                options={userOptions}
              />
              <ErrorField name="assigneeId" />
            </div>
            }
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                type="submit"
                className="btn--light-blue"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </AutoForm>
        ) : assignToWorkQueue ? (
          <AutoForm //model={model}
            schema={workQueueSchema}
            onSubmit={this.assignToWorkQueue}
          >
            <div className="form-wrapper select-item">
              <AutoField
                // 
                name="workQueueId"
                options={workQueueOptions}
              />
              <ErrorField name="workQueueId" />
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                type="submit"
                className="btn--light-blue"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </AutoForm>
        ) : (
          <div>
            <NewAction
              freezeAccount={false}
              closeRightPanel={false}
              hide={this.closeDialog}
              // 
              account={false}
              accountIds={accountIds}
              bulkAssign={bulkAssign}
              params={bulkAssign ? ParamsService.getAccountParams() : false}
              bulkOption={true}
            />
          </div>
        )}
      </div>
    );
  };

  render() {
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
  },
  facilityId: {
    type: String,
    optional: true
  }
});

const workQueueSchema = new SimpleSchema({
  workQueueId: {
    type: String
  }
});
