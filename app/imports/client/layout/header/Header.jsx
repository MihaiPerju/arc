import React, { Component } from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { getImagePath } from "../../../api/utils";
import RoutesService from "./../leftMenu/RoutesService";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import Notifications from "./components/Notifications";

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

  state = { activeItem: "Dashboard" };

  render() {
    const user = Meteor.user();

    let routes = [
      { name: "/dashboard", label: "Home" },
      { name: "/accounts", label: "Accounts" }
    ];
    if (user && user.roles && user.roles.includes(RolesEnum.ADMIN)) {
      routes.push(
        { name: "/admin/user/list", label: "User Management" },
        { name: "/letter-templates/list", label: "Letter templates" }
      );
    }
    if (user && user.roles && user.roles.includes(RolesEnum.TECH)) {
      routes.push({
        name: "/letter-templates/list",
        label: "Letter templates"
      });
    }

    const adminAndTechRoutes = [
      { name: "/client/list", label: "Clients" },
      { name: "/code/list", label: "CARC/RARC Codes" },
      { name: "/reports/list", label: "Reports" },
      { name: "/action/list", label: "Actions" },
      { name: "/inscompany/list", label: "Insurance Companies" }
    ];

    const managerRoutes = [
      { name: "/letter-templates/list", label: "Letter templates" },
      { name: "/reports/list", label: "Reports" }
    ];

    if (
      user &&
      Roles.userIsInRole(user._id, [RolesEnum.ADMIN, RolesEnum.TECH])
    ) {
      routes = routes.concat(adminAndTechRoutes);
    }
    if (user && Roles.userIsInRole(user._id, [RolesEnum.MANAGER])) {
      routes = routes.concat(managerRoutes);
    }

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
                </a>
              </div>
              <div className={this.state.dropdown ? "right__side open" : "right__side"}>
                <div className="owner-menu">
                  <Notifications/>
                  {(isRep)
                    ? user.profile && (
                        <a href={`/${user._id}/activity`} className="toggle-dropdown">
                          <span>
                            {user.profile.firstName +
                              " " +
                              user.profile.lastName}
                          </span>
                          <div className="profile-img" />
                        </a>
                      )
                    : user.profile && (
                        <a href="" className="toggle-dropdown" onClick={this.openDropdown} ref={this.nodeRef}>
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
