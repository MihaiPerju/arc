import React from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import { AutoForm, AutoField, ErrorField, SelectField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";
import WorkQueueService from "./../../services/WorkQueueService";
import workQueueQuery from "/imports/api/tags/queries/listTags";
import Loading from "/imports/client/lib/ui/Loading";
import { moduleNames } from "/imports/api/tags/enums/tags";
import PagerService from "/imports/client/lib/PagerService";
import NewAction from "./NewAction";

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
      userOptions: false
    };
  }

  componentWillMount() {
    workQueueQuery
      .clone({
        filters: {
          entities: { $in: [moduleNames.USERS] }
        }
      })
      .fetch((err, res) => {
        if (!err) {
          const workQueueOptions = WorkQueueService.createOptions(res);
          this.setState({
            workQueueOptions,
            loadingWorkQueues: false
          });
        }
      });

      this.props.bulkAssign ? this.setState({ userOptions: [] }) : this.setState({ userOptions: this.props.options });
  }

  closeDialog = () => {
    const { closeDialog } = this.props;
    closeDialog();
  };

  assignToUser = ({ assigneeId }) => {
    const { accountIds, uncheckAccountList, bulkAssign } = this.props;
    this.setState({ isDisabled: true });
    const params = bulkAssign ? PagerService.getParams().filters : false;
    Meteor.call("account.assignUser.bulk", { accountIds, assigneeId, params }, err => {
      if (!err) {
        Notifier.success("Account assigned to user!");
        uncheckAccountList();
        this.closeDialog();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });  
  };
  assignToWorkQueue = ({ workQueueId }) => {
    const { accountIds, uncheckAccountList, bulkAssign } = this.props;
    this.setState({ isDisabled: true });
    const params = bulkAssign ? PagerService.getParams().filters : false;
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
    if(field == 'facilityId') {
      Meteor.call(
        "account.facility.user",
         value ,
        (err, userOptions) => {
          if (!err) {
            this.setState({userOptions});
          } else {
            this.setState({userOptions: []});
          }
        }
      );
     
    }
  }

  showDialog = () => {
    const { options, assignToUser, bulkAssign, facilitiesOption, assignToWorkQueue } = this.props;

    const { workQueueOptions, loadingWorkQueues, isDisabled, userOptions } = this.state;

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
            onChange={this.onHandleChange.bind(this)}
          >
            {bulkAssign && 
                <div className="form-wrapper select-item">
                <SelectField  name="facilityId" labelHidden={true} options={facilitiesOption}  placeholder="Select Facility" />
                <ErrorField name="facilityId" />
                </div>
            }
            <div className="form-wrapper select-item">
              <SelectField
                labelHidden={true}
                name="assigneeId"
                placeholder="Select Users"
                options={userOptions}
              />
              <ErrorField name="assigneeId" />
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
        ) : assignToWorkQueue ? (
          <AutoForm //model={model}
            schema={workQueueSchema}
            onSubmit={this.assignToWorkQueue}
          >
            <div className="form-wrapper select-item">
              <AutoField
                labelHidden={true}
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
        ) : 
        (
          <NewAction
          freezeAccount={false}
          closeRightPanel={false}
          hide={this.closeDialog}
          account={false}
          bulkAssign = {bulkAssign}
        /> ) }
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
