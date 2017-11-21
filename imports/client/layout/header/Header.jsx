import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu } from 'semantic-ui-react';
import UserRoles from '/imports/api/users/enums/roles';
import { createContainer } from 'meteor/react-meteor-data';

class Header extends Component {
    state = {activeItem: 'Home'};

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;
        const user = this.props.user;

        let routes = [
            {name: "/", label: "Home"},
        ];

        let unloggedUserRoutes = [
            {name: "/login", label: "Login"},
        ];

        let loggedUserRoutes = [
            {name: "/client/list", label: "Clients"},
            {name: "/admin/user/list", label: "User Management"},
            {name: "/code/list", label: "CARC/RARC Codes"}
        ];

        const adminAndTechRoutes = [
            {name: "/action/list", label: "Actions"}
        ];

        if (user) {
            routes = routes.concat(loggedUserRoutes);
            if(Roles.userIsInRole(user._id, [UserRoles.ADMIN, UserRoles.TECH])) {
                routes = routes.concat(adminAndTechRoutes);
            }
        } else {
            routes = routes.concat(unloggedUserRoutes);
        }

        return (
            <Menu inverted fixed="top">
                {
                    routes.map(value => (
                        <Menu.Item 
                            href={value.name} 
                            key={value.label} 
                            active={activeItem === value.label} 
                            name={value.label} 
                            color="blue" 
                            onClick={this.handleItemClick}
                        />
                         ))
                }
                {user && <Menu.Menu position='right'>
                    <Dropdown 
                        icon="user" 
                        item 
                        text={user.profile.firstName + " " + user.profile.lastName} 
                        name="user" 
                        onClick={this.handleItemClick}>
                        <Dropdown.Menu>
                            <Dropdown.Item href="/my-profile">My Profile</Dropdown.Item>
                            <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
                }  
            </Menu>
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
