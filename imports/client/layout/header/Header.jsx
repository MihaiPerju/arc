import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Menu from "/imports/client/layout/header/Menu";


class Header extends Component {
    render() {
        const unloggedUserRoutes = [
            {name: "home", label: "Home"},
            {name: "login", label: "Login"},
            {name: "register", label: "Register"}
        ];
        const loggedUserRoutes = [
            {name: "home", label: "Home"},
            {name: "login", label: "Login"},
            {name: "register", label: "Register"},
            {name: "client/list", label: "Clients"},
            {name: "admin/user/list", label: "User Management"},
            {name: "code/list", label: "CARC/RARC Codes"}
        ];

        return (
            <header className="cc-header">
                <Menu routes={Meteor.user() ? loggedUserRoutes : unloggedUserRoutes}/>
            </header>
        )
    }
}

Header.propTypes = {};
Header.defaultProps = {};

export default Header;
