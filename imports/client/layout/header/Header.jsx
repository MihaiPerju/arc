import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Dropdown, Menu, Container} from 'semantic-ui-react';
import UserRoles from '/imports/api/users/enums/roles';
import {createContainer} from 'meteor/react-meteor-data';
import RolesEnum from '/imports/api/users/enums/roles';

class Header extends Component {
    state = {activeItem: 'Dashboard'};

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        const {activeItem} = this.state;
        const user = this.props.user;

        let routes = [
            {name: "/home", label: "Home"},
            {name: "/client/list", label: "Clients"},
            {name: "/admin/user/list", label: "User Management"},
            {name: "/code/list", label: "CARC/RARC Codes"},
            {name: "/tasks", label: "Tasks"},
            {name: "/reports/list", label: "Reports"}
        ];
        if(user && user.roles && user.roles.includes(RolesEnum.ADMIN)){
            routes.push(
                {name:'/region/list', label:'Regions'},
                {name: "/letter-templates/list", label: "Letter templates"}
            )
        }
        if(user && user.roles && user.roles.includes(RolesEnum.TECH)){
            routes.push(
                {name: "/letter-templates/list", label: "Letter templates"}
            )
        }

        const adminAndTechRoutes = [
            {name: "/action/list", label: "Actions"}
        ];

        if (user && Roles.userIsInRole(user._id, [UserRoles.ADMIN, UserRoles.TECH])) {
            routes = routes.concat(adminAndTechRoutes);
        }

        return (
            <Container>
                {user &&
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
                    <Menu.Menu position='right'>
                        <Dropdown
                            icon="user"
                            item
                            text={user.profile.firstName + " " + user.profile.lastName}
                            name="user"
                            onClick={this.handleItemClick}>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/my-profile">My Profile</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Menu.Item>
                            <Button href="/logout">Log out</Button>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                }
            </Container>
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
