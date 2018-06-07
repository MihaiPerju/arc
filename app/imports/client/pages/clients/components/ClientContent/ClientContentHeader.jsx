import React, { Component } from "react";
import { getImagePath } from "../../../../../api/utils";
import { roleGroups } from "/imports/api/users/enums/roles";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import {
  AutoForm,
  AutoField,
  ErrorField,
  ListField,
  ListItemField,
  NestField,
  TextField,
  LongTextField
} from "/imports/ui/forms";
import Auto from "../../../../../ui/forms/AutoForm";
import SimpleSchema from "simpl-schema";
import managersListQuery from "/imports/api/users/queries/listUsers";
import RolesEnum from "/imports/api/users/enums/roles";

export default class ClientContentHeader extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false,
      isAssigning: false,
      managers: []
    };
  }

  componentWillMount() {
    managersListQuery
      .clone({ filters: { roles: { $in: [RolesEnum.MANAGER] } } })
      .fetch((err, managers) => {
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
    Meteor.call("client.switchStatus", _id, status, (err, res) => {
      if (!err) {
        const message = status ? "Client disabled!" : "Client enabled!";
        Notifier.success(message);
        this.onClose();
      }
    });
  };

  onSubmit = managerIds => {
    const { client } = this.props;

    const data = { ...managerIds };
    const { _id } = client;
    Meteor.call("client.update", _id, data, err => {
      if (err) {
        Notifier.error(err.reason);
      } else {
        Notifier.success("Managers Assigned!");
        this.closeDialog();
      }
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
    const { dialogIsActive, isAssigning, managers } = this.state;

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
          alt=""
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
            {Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) && (
              <div className="btn-group flex--helper flex--wrap flex-justify--end">
                <div className="btn-group__row flex--helper flex--wrap">
                  <div className="btn-group__item">
                    <a
                      href={FlowRouter.url("region.list", { id: client._id })}
                      className="cc-button btn--white"
                    >
                      Manage regions
                    </a>
                  </div>
                  <div className="btn-group__item">
                    <a
                      href={"/client/" + client._id + "/manage-facilities"}
                      className="cc-button btn--white"
                    >
                      Manage facilities
                    </a>
                  </div>
                </div>

                <div className="btn-group__row flex--helper flex--wrap">
                  <div className="btn-group__item">
                    <button onClick={this.onEdit} className="btn--white">
                      Edit client
                    </button>
                  </div>
                  <div className="btn-group__item">
                    <button
                      type="button"
                      onClick={() =>
                        this.disableAction(client._id, client.status)
                      }
                      className="btn--white"
                    >
                      {client.status ? "Disable client" : "Enable client"}
                    </button>
                  </div>
                  <div className="btn-group__item">
                    <button
                      type="button"
                      onClick={() => this.onOpenAssignDialog()}
                      className="btn--white"
                    >
                      Assign Manager
                    </button>
                  </div>
                </div>
              </div>
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
                    labelHidden={true}
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
                <button className="btn--light-blue">Confirm</button>
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
