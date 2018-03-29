import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UserRoles from '/imports/api/users/enums/roles';
import {createContainer} from 'meteor/react-meteor-data';
import RolesEnum from '/imports/api/users/enums/roles';
import Menu from './Menu';
import classNames from 'classnames';

class LeftMenu extends Component {
    constructor() {
        super();
        this.state = {
            collapse: false
        }
    }

    collapseMenu = () => {
        const {collapse} = this.state;
        this.setState({
            collapse: !collapse
        })
    }

    render() {
        const user = this.props.user;
        const {collapse} = this.state;

        const menuClasses = classNames({
            'left-menu': true,
            'collapsed': collapse
        });

        let routes = [
            {name: "/home", label: "Home"},
            {name: "/tasks", label: "Tasks"},
        ];

        if (user && user.roles && user.roles.includes(RolesEnum.ADMIN)) {
            routes.push(
                {name: "/admin/user/list", label: "User Management"},
                {name: '/region/list', label: 'Regions'},
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
            {name: "/action/list", label: "Actions"}
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
                <div className={menuClasses}>
                    <Menu routes={[
                        {name: "accounts", label: "Account", icon: 'user', badge: 1},
                        {name: "accounts", label: "Review", icon: 'inbox', badge: 10},
                        {name: "accounts", label: "On Hold", icon: 'hand-paper-o', badge: 39},
                        {name: "accounts", label: "Archived", icon: 'archive', badge: 12},
                        {name: "accounts", label: "Escalations", icon: 'info', badge: 9},
                        {name: "accounts", label: "Tickles", icon: 'comments-o', badge: 1},
                        {name: "accounts", label: "Unassigned", icon: 'question-circle-o', badge: 20},
                        {name: "client/list", label: "Clients", icon: 'users'},
                        {name: "admin/user/list", label: "User management", icon: 'user-circle-o'},
                        {name: "code/list", label: "Codes", icon: 'code-fork'},
                        {name: "reports/list", label: "Reports", icon: 'file-text-o'},
                        {name: "letter-templates/list", label: "Templates", icon: 'window-restore'},
                        {name: "action/list", label: "Actions", icon: 'thumb-tack'}
                    ]}/>
                    <div className="btn-collapse text-center" onClick={this.collapseMenu}>
                        <i className="icon-angle-left"/>
                    </div>
                </div>
                }
            </div>
        )
    }
}

LeftMenu.propTypes = {
    user: React.PropTypes.object,
};
LeftMenu.defaultProps = {};

export default LeftMenuContainer = createContainer(() => {
    const user = Meteor.user();

    return {
        user,
    };
}, LeftMenu);