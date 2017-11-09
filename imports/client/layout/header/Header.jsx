import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Menu from "/imports/client/layout/header/Menu";
import UserRoles from '/imports/api/users/enums/roles';
import { createContainer } from 'meteor/react-meteor-data';

class Header extends Component {
    render() {
        user = this.props.user;
        const unloggedUserRoutes = [
            {name: "home", label: "Home"},
            {name: "login", label: "Login"},
            {name: "register", label: "Register"}
        ];
        let loggedUserRoutes = [
            {name: "home", label: "Home"},
            {name: "login", label: "Login"},
            {name: "register", label: "Register"},
            {name: "client/list", label: "Clients"},
            {name: "admin/user/list", label: "User Management"},
            {name: "code/list", label: "CARC/RARC Codes"}
        ];
        const adminAndTechRoutes = [
            {name: "action/list", label: "Actions"}
        ];

        if (user && Roles.userIsInRole(user._id, [UserRoles.ADMIN, UserRoles.TECH])) {
            loggedUserRoutes = loggedUserRoutes.concat(adminAndTechRoutes);
        }

        return (
            <header className="cc-header">
                <Menu routes={user ? loggedUserRoutes : unloggedUserRoutes}/>
            </header>
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
