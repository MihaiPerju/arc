import React, { Component } from "react";
import classNames from "classnames";
import { getImagePath } from "/imports/api/utils.js";
import { roleGroups } from "/imports/api/users/enums/roles";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";

export default class FacilityContentHeader extends Component {
  constructor() {
    super();
    this.state = {
      dropdown: false,
      dialogIsActive: false
    };
  }

  openDropdown = () => {
    const { dropdown } = this.state;
    if (!dropdown) {
      // attach/remove event handler
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState({
      dropdown: !dropdown
    });
  };

  handleOutsideClick = e => {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

  nodeRef = node => {
    this.node = node;
  };

  onEditFacility = () => {
    const { onEdit } = this.props;
    onEdit();
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  confirmDisable = () => {
    this.setState({
      dialogIsActive: false
    });
    this.onToggleFacilityStatus();
  };

  disableAction = (_id, status) => {
    this.setState({
      dialogIsActive: true,
      _id,
      status
    });
  };

  onClose = () => {
    const { setFacility } = this.props;
    setFacility();
  };

  onToggleFacilityStatus = () => {
    const { _id, status } = this.state;
    Meteor.call("facility.switchStatus", _id, status, (err) => {
      if (!err) {
        const message = status ? "Facility disabled !" : "Facility enabled !";
        Notifier.success(message);
        this.onClose();
      }
    });
  };

  render() {
    const { dropdown, dialogIsActive } = this.state;
    const { facility } = this.props;
    const classes = classNames({
      dropdown: true,
      open: dropdown
    });

    return (
      <div className="main-content__header header-block">
        <div className="row__header flex--helper flex-justify--space-between flex-align--start">
          <div className="row__wrapper flex--helper flex-align--center">
            {facility && facility.logoPath ? (
              <img src={getImagePath(facility.logoPath)} />
            ) : (
              <img
                src="/assets/img/user.svg"
                className="lg-avatar-1 img-circle"
                alt=""
              />
            )}
            <div className="title truncate">{facility.name}</div>
          </div>
          {Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) && (
            <div className="btn-group flex--helper flex--wrap">
              <button
                type="button"
                onClick={() => this.onEditFacility(facility)}
                className="btn-edit btn--white"
              >
                Edit facility
              </button>
              <button
                type="button"
                onClick={() =>
                  this.disableAction(facility._id, facility.status)
                }
                className="btn-edit btn--white"
              >
                {facility.status ? "Disable facility" : "Enable facility"}
              </button>
            </div>
          )}
        </div>
        <ul className="row__info main-info flex--helper">
          <li className="text-center">
            <div className="text-light-grey">Status</div>
            <div className="info-label">
              {facility.status ? "Active" : "Inactive"}
            </div>
          </li>
          <li className="text-center">
            <div className="text-light-grey">First address</div>
            <div className="info-label">
              {facility.addressOne ? facility.addressOne : "None"}
            </div>
          </li>
          <li className="text-center">
            <div className="text-light-grey">Second address</div>
            <div className="info-label">
              {facility.addressTwo ? facility.addressTwo : "None"}
            </div>
          </li>
          <li className="text-center">
            <div className="text-light-grey">City</div>
            <div className="info-label">
              {facility.city ? facility.city : "None"}
            </div>
          </li>

          <li className="text-center">
            <div className="text-light-grey">State</div>
            <div className="info-label">None</div>
          </li>
        </ul>
        <ul className="row__info additionl-info flex--helper flex--wrap">
          <li className="text-center">
            <div className="text-light-grey">Sftp Path</div>
            <div className="info-label">
              {facility.sftpPath ? facility.sftpPath : "None"}
            </div>
          </li>
          <li className="text-center">
            <div className="text-light-grey">Zip code</div>
            <div className="info-label">
              {facility.zipCode ? facility.zipCode : "None"}
            </div>
          </li>
          <li className="text-center">
            <div className="text-light-grey">Region</div>
            <div className="info-label">
              {facility.region ? facility.region.name : "None"}
            </div>
          </li>
          <li className="text-center toggle-allow-users">
            <div className={classes}>
              <div
                className="dropdown__header"
                onClick={this.openDropdown}
                ref={this.nodeRef}
              >
                <div className="text-light-grey">Allowed users</div>
                <div className="info-label">
                  <span>{facility.users.length} users</span>
                </div>
              </div>
              {dropdown && <Dropdown users={facility.users} />}
            </div>
          </li>
        </ul>
        {dialogIsActive && (
          <Dialog
            className="account-dialog"
            closePortal={this.closeDialog}
            title="Confirm"
          >
            <div className="form-wrapper">
              Are you sure you want to {facility.status ? "disable" : "enable"}{" "}
              this facility?
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button className="btn--light-blue" onClick={this.confirmDisable}>
                Confirm & {facility.status ? "disable" : "enable"}
              </button>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}

class Dropdown extends Component {
  render() {
    const imgPath = "/assets/img/";
    const { users } = this.props;
    return (
      <div className="dropdown__wrapper">
        <ul className="allow-list">
          {users.map(function(user, index) {
            return (
              <li className="allow-item" key={index}>
                <div className="name truncate">
                  {user.profile.firstName + " " + user.profile.lastName}
                </div>
                {user.avatar ? (
                  <img
                    className="md-avatar img-circle"
                    src={getImagePath(user.avatar.path)}
                    alt=""
                  />
                ) : (
                  <img
                    className="md-avatar img-circle"
                    src={imgPath + "user.svg"}
                    alt=""
                  />
                )}
              </li>
            );
          })}
        </ul>
        <div className="dropdown__footer">
          <div className="btn-group">
            <div className="btn-prev">
              <i className="icon-angle-left" />
            </div>
            <div className="btn-next">
              <i className="icon-angle-right" />
            </div>
          </div>
          <div className="right--side">
            1-4<span className="text-light-grey"> of </span>5
          </div>
        </div>
      </div>
    );
  }
}
