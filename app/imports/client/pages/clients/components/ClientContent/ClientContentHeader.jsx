import React, { Component } from "react";
import { getImagePath } from "../../../../../api/utils";
import { roleGroups } from "/imports/api/users/enums/roles";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import ActionDropdown from "./ActionDropdown";
import { AutoForm, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";

export default class ClientContentHeader extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false,
      isAssigning: false,
      managers: [],
      isDisabled: false
    };
  }

  componentWillMount() {
    Meteor.call("users.getManagers", (err, managers) => {
      if (!err) {
        this.setState({ managers });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false,
      isAssigning: false
    });
  };

  confirmDisable = () => {
    this.setState({
      dialogIsActive: false
    });
    this.onToggleClientStatus();
  };

  disableAction = (_id, status) => {
    this.setState({
      dialogIsActive: true,
      _id,
      status
    });
  };

  onClose = () => {
    const { setClient } = this.props;
    setClient();
  };
  onOpenAssignDialog = () => {
    this.setState({ isAssigning: true });
  };

  onToggleClientStatus = () => {
    const { _id, status } = this.state;
    Meteor.call("client.switchStatus", _id, status, err => {
      if (!err) {
        const message = status ? "Client disabled!" : "Client enabled!";
        Notifier.success(message);
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onSubmit = ({ managerIds }) => {
    const { client } = this.props;
    const { _id } = client;
    this.setState({ isDisabled: true });
    Meteor.call("client.assign", _id, managerIds, err => {
      if (err) {
        Notifier.error(err.reason);
      } else {
        Notifier.success("Managers Assigned!");
        this.closeDialog();
      }
      this.setState({ isDisabled: false });
    });
  };

  getManagerOptions(managers) {
    return _.map(managers, ({ _id, profile }) => {
      const value = `${profile.firstName} ${profile.lastName}`;
      return { value: _id, label: value };
    });
  }

  render() {
    const { client } = this.props;
    const { dialogIsActive, isAssigning, managers, isDisabled } = this.state;

    const managerIdsOptions = this.getManagerOptions(managers);
    return (
      <div className="header-block">
        <img
          src={
            client.logoPath
              ? getImagePath(client.logoPath)
              : "/assets/img/user.svg"
          }
          className="lg-avatar img-circle"
          alt="Client Logo"
        />
        <div className="header-block__wrapper">
          <div className="intro-row">
            <div className="text-light-grey">Client name</div>
            <div className="name">{client.clientName}</div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <span className="text-light-grey">Email</span>
              <span className="text text-blue">{client.email}</span>
            </div>
            {Roles.userIsInRole(
              Meteor.userId(),
              roleGroups.ADMIN_TECH_MANAGER
            ) && (
              <ActionDropdown
                facilityHref={"/client/" + client._id + "/manage-facilities"}
                ruleHref={"/client/" + client._id + "/manage-rules"}
                regionHref={FlowRouter.url("region.list", { id: client._id })}
                workQueueHref={"/client/" + client._id + "/work-queues"}
                onEdit={this.onEdit}
                disableAction={() =>
                  this.disableAction(client._id, client.status)
                }
                onOpenAssignDialog={this.onOpenAssignDialog}
                status={client.status}
              />
            )}
          </div>
        </div>
        {dialogIsActive && (
          <Dialog
            className="account-dialog"
            closePortal={this.closeDialog}
            title="Confirm"
          >
            <div className="form-wrapper">
              Are you sure you want to {client.status ? "disable" : "enable"}{" "}
              this client?
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button className="btn--light-blue" onClick={this.confirmDisable}>
                Confirm & {client.status ? "disable" : "enable"}
              </button>
            </div>
          </Dialog>
        )}
        {isAssigning && (
          <Dialog
            className="account-dialog"
            closePortal={this.closeDialog}
            title="Confirm"
          >
            <AutoForm
              model={client}
              schema={assignSchema}
              onSubmit={this.onSubmit}
              ref="form"
            >
              <div className="form-wrapper">
                Assign a manager to this client
              </div>

              <div className="select-group">
                <div className="form-wrapper">
                  <SelectMulti
                    
                    placeholder="Managers"
                    name="managerIds"
                    options={managerIdsOptions}
                  />
                  <ErrorField name="managerIds" />
                </div>
              </div>
              <div className="btn-group">
                <button className="btn-cancel" onClick={this.closeDialog}>
                  Cancel
                </button>
                <button
                  style={isDisabled ? { cursor: "not-allowed" } : {}}
                  disabled={isDisabled}
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
          </Dialog>
        )}
      </div>
    );
  }
}

const assignSchema = new SimpleSchema({
  managerIds: {
    type: Array,
    optional: true
  },
  "managerIds.$": {
    type: String
  }
});
