import React, { Component } from "react";
import { roleGroups } from "/imports/api/users/enums/roles";

export default class ActionDropdown extends Component {
  constructor() {
    super();
    this.state = {
      isOpenedDropdown: false
    };
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.outsideClick, false);
  }

  openDropdown = () => {
    const { isOpenedDropdown } = this.state;

    if (!isOpenedDropdown) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }

    this.setState({
      isOpenedDropdown: !isOpenedDropdown
    });
  };

  outsideClick = e => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

  nodeRef = node => {
    this.node = node;
  };

  render() {
    const { isOpenedDropdown } = this.state;
    const {
      status,
      facilityHref,
      regionHref,
      ruleHref,
      tagHref,
      onEdit,
      disableAction,
      onOpenAssignDialog
    } = this.props;

    const style = { cursor: "pointer" };

    return (
      <div className="action-dropdown" ref={this.nodeRef}>
        <div className="action-dropdown__btn" onClick={this.openDropdown}>
          Options
          <i className="icon-angle-down" />
        </div>
        {isOpenedDropdown && (
          <div className="action-dropdown__container">
            <div className="action-caret">
              <div className="action-caret__outer" />
              <div className="action-caret__inner" />
            </div>
            <ul className="action-list">
              <li className="action-item">
                <a href={regionHref}>Manage Regions</a>
              </li>
              <li className="action-item">
                <a href={facilityHref}>Manage Facilities</a>
              </li>
              <li className="action-item">
                <a href={ruleHref}>Manage Rules</a>
              </li>
              <li className="action-item">
                <a href={tagHref}>Manage Tags</a>
              </li>
              {Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) && (
                <li className="action-item">
                  <a style={style} onClick={onEdit}>
                    Edit client
                  </a>
                </li>
              )}
              {Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) && (
                <li className="action-item">
                  <a style={style} onClick={disableAction}>
                    {status ? "Disable client" : "Enable client"}
                  </a>
                </li>
              )}
              {Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) && (
                <li className="action-item">
                  <a style={style} onClick={onOpenAssignDialog}>
                    Assign Manager
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
