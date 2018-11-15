import React from 'react';
import { NavLink } from 'react-router-dom';
import history from '../../history';

export default class Menu extends React.Component {
// ${this.props.path === item.route ? 'cc--active' : ''}
    renderMenuItems = () => {
        return this.props.menuItems.map(item => {
            if(!item.roles.some(role => role === this.props.role))
                return null;

            return (
                <li className={`menu__item`} key={item.route}>
                    <NavLink to={item.route} activeClassName={'cc--active'}>
                        <div className="menu__icon">
                            <i className={`icon-${item.icon}`} />
                        </div>
                        <span className="menu__label">
                            {item.label}
                        </span>
                    </NavLink>
                </li>
            );
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