import React from 'react';
import MenuItem from './MenuItem';

export default class Menu extends React.PureComponent {
    // TODO: Add menu item active class (cc--active)
    renderMenuItems() {
        return this.props.menuItems.map((item, index) => {
            if(!item.roles.some(role => role === this.props.role))
                return null;

            return (
                <MenuItem
                    key={index}
                    className={"menu__item"}
                    name={item.name}
                    route={item.route}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                />
            )
        })
    }
    
    render() {
        return (
            <ul className="left-menu__wrapper">
                {this.renderMenuItems()}
            </ul>
        )
    }
}