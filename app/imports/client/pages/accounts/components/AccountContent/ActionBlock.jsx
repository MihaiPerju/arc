import React, { Component } from "react";
import NewAction from "./NewAction";
import moment from "moment";
import Dialog from "/imports/client/lib/ui/Dialog";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import classNames from "classnames";
import Loading from "/imports/client/lib/ui/Loading";
import SimpleSchema from "simpl-schema";
import { AutoForm, ErrorField, AutoField } from "/imports/ui/forms";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti";
import flagsQuery from "/imports/api/flags/queries/flagList";
import Notifier from "/imports/client/lib/Notifier";
import RolesEnum from "/imports/api/users/enums/roles";

class ActionBlock extends Component {
  constructor() {
    super();
    this.state = {
      createAction: false,
      dialogIsActive: false,
      selectedActionId: null,
      flags: [],
      selectedFlag: {}
    };
  }

  newAction = () => {
    const { createAction } = this.state;
    this.setState({
      createAction: !createAction
    });
  };

  onOpenDialog = id => {
    const { data } = this.props;
    let selectedFlag = {};
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      selectedFlag = data.filter(flag => flag.actionId === id)[0] || {};
    }
    this.setState({
      dialogIsActive: true,
      selectedActionId: id,
      selectedFlag
    });
  };

  onCloseDialog = () => {
    this.setState({
      dialogIsActive: false,
      selectedActionId: null,
      selectedFlag: {}
    });
  };

  onFlagAdd = data => {
    const { selectedActionId } = this.state;
    data.actionId = selectedActionId;

    Meteor.call("flag.create", data, err => {
      if (!err) {
        Notifier.success("Flag created");
      } else {
        Notifier.error(error.reason);
      }
      this.onCloseDialog();
    });
  };

  isFlagChecked = actionId => {
    const { data } = this.props;
    const index = data.findIndex(flag => flag.actionId === actionId);
    return index > -1 ? true : false;
  };

  isDisabledForReps = actionId => {
    const { data } = this.props;
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.REP)) {
      const index = data.findIndex(
        flag => flag.actionId === actionId && flag.open
      );
      return index > -1 ? true : false;
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      const index = data.findIndex(
        flag => flag.actionId === actionId && flag.open
      );
      return index === -1 ? true : false;
    }
  };

  onUnflag = data => {
    const { selectedFlag } = this.state;
    const { message } = data;

    Meteor.call("flag.remove", { _id: selectedFlag._id, message }, err => {
      if (!err) {
        Notifier.success("Flag removed");
      } else {
        Notifier.error(error.reason);
      }
      this.onCloseDialog();
    });
  };

  render() {
    const { account, closeRightPanel, isLoading, error } = this.props;
    const actionsPerformed = account.actions;
    const { dialogIsActive, selectedFlag } = this.state;
    const dialogClasses = classNames("account-dialog");
    const userId = Meteor.userId();
    const fieldOptions = [
      { value: "field1", label: "field1" },
      { value: "field2", label: "field2" },
      { value: "field3", label: "field3" }
    ];

    const metafieldOptions = [
      { value: "metafield1", label: "metafield1" },
      { value: "metafield2", label: "metafield2" },
      { value: "metafield3", label: "metafield3" }
    ];

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    console.log("selectedFlag", selectedFlag);

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">actions</div>
        </div>
        <div className="main__block">
          <div className="add-content" onClick={this.newAction}>
            <i className="icon-thumb-tack" />
            <div className="text-center">+ Add new action</div>
          </div>
          {this.state.createAction ? (
            <NewAction
              closeRightPanel={closeRightPanel}
              hide={this.newAction}
              account={account}
            />
          ) : null}
          <div className="action-list">
            {actionsPerformed &&
              actionsPerformed.map((actionPerformed, key) => (
                <div className="action-item" key={key}>
                  <div className="action-info">
                    <div className="info">
                      <div className="name">
                        {actionPerformed.user &&
                          actionPerformed.user.profile.firstName +
                            " " +
                            actionPerformed.user.profile.lastName}
                      </div>
                      <div className="text text-light-grey">
                        <b>{actionPerformed.reasonCode}</b>:
                        {actionPerformed.action && actionPerformed.action.title}
                      </div>
                    </div>
                    <div className="status archived">
                      {actionPerformed.action && actionPerformed.action.status}
                    </div>
                  </div>
                  <div className="action-time">
                    {moment(
                      actionPerformed && actionPerformed.createdAt
                    ).format("MMMM Do YYYY, hh:mm a")}
                  </div>
                  <div className="flag-item">
                    <input
                      checked={this.isFlagChecked(actionPerformed._id)}
                      disabled={this.isDisabledForReps(actionPerformed._id)}
                      onChange={() => this.onOpenDialog(actionPerformed._id)}
                      type="checkbox"
                      id={key}
                      className="hidden"
                    />
                    <label htmlFor={key} />
                  </div>
                </div>
              ))}
          </div>
          {dialogIsActive && (
            <Dialog
              className={dialogClasses}
              closePortal={this.onCloseDialog}
              title="Flag action"
            >
              {Roles.userIsInRole(userId, RolesEnum.REP) && (
                <AutoForm onSubmit={this.onFlagAdd} schema={flagSchema}>
                  <div className="form-wrapper">
                    <SelectMulti
                      labelHidden={true}
                      placeholder="Select fields"
                      name="fields"
                      options={fieldOptions}
                    />
                    <ErrorField name="fields" />
                  </div>
                  <div className="form-wrapper">
                    <SelectMulti
                      labelHidden={true}
                      placeholder="Select meta-fields"
                      name="metafields"
                      options={metafieldOptions}
                    />
                    <ErrorField name="metafields" />
                  </div>
                  <div className="btn-group">
                    <button className="btn-cancel" onClick={this.onCloseDialog}>
                      Cancel
                    </button>
                    <button type="submit" className="btn--light-blue">
                      Confirm & send
                    </button>
                  </div>
                </AutoForm>
              )}
              {Roles.userIsInRole(userId, RolesEnum.MANAGER) && (
                <AutoForm onSubmit={this.onUnflag} schema={unFlagSchema}>
                  <div className="form-wrapper">
                    <b>fields:</b>
                    {selectedFlag.fields.map((field, index) => (
                      <span key={index}>{field} </span>
                    ))}

                    <b>metafields:</b>
                    {selectedFlag.metafields.map((metafield, index) => (
                      <span key={index}>{metafield} </span>
                    ))}
                  </div>
                  <div className="form-wrapper">
                    <AutoField
                      labelHidden={true}
                      placeholder="Type a message"
                      name="message"
                    />
                    <ErrorField name="message" />
                  </div>
                  <div className="btn-group">
                    <button className="btn-cancel" onClick={this.onCloseDialog}>
                      Cancel
                    </button>
                    <button type="submit" className="btn--light-blue">
                      Confirm & send
                    </button>
                  </div>
                </AutoForm>
              )}
            </Dialog>
          )}
        </div>
      </div>
    );
  }
}

export default withQuery(
  props => {
    return flagsQuery.clone({ filters: { open: true } });
  },
  { reactive: true }
)(ActionBlock);

const flagSchema = new SimpleSchema({
  fields: {
    type: Array
  },
  "fields.$": {
    type: String
  },
  metafields: {
    type: Array
  },
  "metafields.$": {
    type: String
  }
});

const unFlagSchema = new SimpleSchema({
  message: {
    type: String
  }
});
