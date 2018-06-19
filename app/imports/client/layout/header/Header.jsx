import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UserRoles from '/imports/api/users/enums/roles';
import {createContainer} from 'meteor/react-meteor-data';
import RolesEnum from '/imports/api/users/enums/roles';
import {getImagePath} from "../../../api/utils";
import RoutesService from "./../leftMenu/RoutesService";

class Header extends Component {
    constructor() {
        super();
        this.state = {
            dropdown: false,
        }
    }

    openDropdown = () => {
        if (!this.state.dropdown) {
            document.addEventListener('click', this.outsideClick, false);
        } else {
            document.removeEventListener('click', this.outsideClick, false)
        }

        this.setState({
            dropdown: !this.state.dropdown
        })
    }

    outsideClick = (e) => {
        if (this.node.contains(e.target)) {
            return;
        }

        this.openDropdown();
    };

    nodeRef = (node) => {
        this.node = node;
    }

    state = {activeItem: 'Dashboard'};

    render() {
        const user = this.props.user;

        let routes = [
            {name: "/home", label: "Home"},
            {name: "/accounts", label: "Accounts"},
        ];
        if (user && user.roles && user.roles.includes(RolesEnum.ADMIN)) {
            routes.push(
                {name: "/admin/user/list", label: "User Management"},
                {name: "/letter-templates/list", label: "Letter templates"}
            )
        }
        if (user && user.roles && user.roles.includes(RolesEnum.TECH)) {
            routes.push(
                {name: "/letter-templates/list", label: "Letter templates"}
            )
        }

        const adminAndTechRoutes = [
            {name: "/client/list", label: "Clients"},
            {name: "/code/list", label: "CARC/RARC Codes"},
            {name: "/reports/list", label: "Reports"},
            {name: "/action/list", label: "Actions"},
            {name: "/inscompany/list", label: "Insurance Companies"}
        ];

        const managerRoutes = [
            {name: "/letter-templates/list", label: "Letter templates"},
            {name: "/reports/list", label: "Reports"}
        ];

        if (user && Roles.userIsInRole(user._id, [UserRoles.ADMIN, UserRoles.TECH])) {
            routes = routes.concat(adminAndTechRoutes);
        }
        if (user && Roles.userIsInRole(user._id, [UserRoles.MANAGER])) {
            routes = routes.concat(managerRoutes);
        }

        return (
            <div>
                {user &&
                <header className="header-bar">
                    <div className="header-bar__wrapper">
                        <div className="left__side flex--helper flex-align--center">
                            <a href="/dashboard">
                                <i className="icon-home"/>
                                <img className="header__logo" src="/assets/img/logo.png" alt=""/>
                            </a>
                        </div>
                        <div className={this.state.dropdown ? "right__side open" : "right__side"}
                             onClick={this.openDropdown} ref={this.nodeRef}>
                            <div className="owner-menu">
                                <a href="">
                                    <span>{user.profile.firstName + " " + user.profile.lastName}</span>
                                    <div className="profile-img">
                                    </div>
                                </a>
                            </div>
                            {this.state.dropdown ? <BtnGroup/> : null}
                        </div>
                    </div>
                </header>
                }
            </div>
        )
    }
}

Header.propTypes = {
    user: React.PropTypes.object,
};
Header.defaultProps = {};

export default HeaderContainer = createContainer(() => {
    const user = Meteor.user();

    return {
        user,
    };
}, Header);

class BtnGroup extends Component {
    render() {
        return (
            <div className="btn-group">
                <a href="/my-profile"><i className="icon-cog"/><span>Settings</span></a>
                <a href="/logout"><i className="icon-sign-out"/><span>Log out</span></a>
            </div>
        )
    }
}