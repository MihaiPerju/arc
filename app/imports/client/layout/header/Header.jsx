import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { getImagePath } from "../../../api/utils";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import Notifications from "./components/Notifications";
import RoutesService from "../leftMenu/RoutesService";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      dropdown: false
    };
  }

  openDropdown = () => {
    if (!this.state.dropdown) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }

    this.setState({
      dropdown: !this.state.dropdown
    });
  };

  outsideClick = e => {
    if (this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

  nodeRef = node => {
    this.node = node;
  };

  handleClick = (id, e) => {
    e.stopPropagation();
    FlowRouter.go(`/${id}/activity`);
  };

  state = { activeItem: "Dashboard" };

  render() {
    const { routeName } = this.props;
    const user = Meteor.user();
    const isRep = user && Roles.userIsInRole(user._id, RolesEnum.REP);

    return (
      <div>
        {user && (
          <header className="header-bar">
            <div className="header-bar__wrapper">
              <div className="left__side flex--helper flex-align--center">
                <a href="/dashboard">
                  <i className="icon-home" />
                  <img
                    className="header__logo"
                    src="/assets/img/logo.png"
                    alt=""
                  />
                  <div className="top-titles">
                    {RoutesService.getRouteName(routeName)}
                  </div>
                </a>
              </div>
              <div
                className={
                  this.state.dropdown ? "right__side open" : "right__side"
                }
              >
                <div className="owner-menu">
                  <Notifications />
                  {isRep
                    ? user.profile && (
                        <div
                          onClick={this.openDropdown}
                          ref={this.nodeRef}
                          className="toggle-dropdown"
                          style={{ cursor: "pointer" }}
                        >
                          <a onClick={this.handleClick.bind(this, user._id)}>
                            {user.profile.firstName +
                              " " +
                              user.profile.lastName}
                          </a>
                          <div className="profile-img" />
                        </div>
                      )
                    : user.profile && (
                        <a
                          href=""
                          className="toggle-dropdown"
                          onClick={this.openDropdown}
                          ref={this.nodeRef}
                        >
                          <span>
                            {user.profile.firstName +
                              " " +
                              user.profile.lastName}
                          </span>
                          <div className="profile-img" />
                        </a>
                      )}
                </div>
                {this.state.dropdown && <BtnGroup />}
              </div>
            </div>
          </header>
        )}
      </div>
    );
  }
}

Header.propTypes = {
  user: React.PropTypes.object
};
Header.defaultProps = {};

export default (HeaderContainer = createContainer(() => {
  const user = Meteor.user();

  return {
    user
  };
}, Header));

class BtnGroup extends Component {
  render() {
    return (
      <div className="btn-group">
        <a href="/my-profile">
          <i className="icon-user" />
          <span>Profile</span>
        </a>
        {Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN) && (
          <a href="/admin/settings">
            <i className="icon-cog" />
            <span>Settings</span>
          </a>
        )}

        <a href="/logout">
          <i className="icon-sign-out" />
          <span>Log out</span>
        </a>
      </div>
    );
  }
}
