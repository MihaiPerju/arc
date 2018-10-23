import React from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";
import WorkQueueService from "./../../services/WorkQueueService";
import workQueueQuery from "/imports/api/tags/queries/listTags";
import Loading from "/imports/client/lib/ui/Loading";
import { moduleNames } from "/imports/api/tags/enums/tags";
import PagerService from "/imports/client/lib/PagerService";
import query from "/imports/api/accounts/queries/accountList";
import { withQuery } from "meteor/cultofcoders:grapher-react";

class AccountActioning extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: true,
      assignToUser: true,
      assignToWorkQueue: false,
      workQueueOptions: [],
      loadingWorkQueues: true,
      isDisabled: false
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
  }

  closeDialog = () => {
    const { closeDialog } = this.props;
    closeDialog();
  };

  assignToUser = ({ assigneeId }) => {
    const { uncheckAccountList, data, selectAllAccount  } = this.props;
    let { accountIds } = this.props;
   if(selectAllAccount === true) {
    let accountIdsList = [];
     _.map(data, rec => {
      accountIdsList.push(rec._id);
     });
     accountIds = accountIdsList;
   }
    this.setState({ isDisabled: true });
    Meteor.call("account.assignUser.bulk", { accountIds, assigneeId }, err => {
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
    const { uncheckAccountList, data, selectAllAccount } = this.props;
    let { accountIds } = this.props;
    if(selectAllAccount === true) {
      let accountIdsList = [];
       _.map(data, rec => {
        accountIdsList.push(rec._id);
       });
       accountIds = accountIdsList;
     }
    this.setState({ isDisabled: true });
    Meteor.call(
      "account.assignWorkQueue.bulk",
      { accountIds, workQueueId },
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

  showDialog = () => {
    const { options, assignToUser } = this.props;

    const { workQueueOptions, loadingWorkQueues, isDisabled } = this.state;

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

export default withQuery(
  props => {
    const params = PagerService.getAccountQueryParams();
    params.perPage = 0;
    return PagerService.setQuery(query, params);
  },
  { reactive: true }
)(AccountActioning);

const assignSchema = new SimpleSchema({
  assigneeId: {
    type: String
  }
});

const workQueueSchema = new SimpleSchema({
  workQueueId: {
    type: String
  }
});
