import React, {Component} from 'react';
import Badge from "/imports/client/lib/Badge";
import FlowHelpers from '/imports/client/routing/helpers';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Menu extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        FlowRouter.watchPathChange();
    }

    render() {
        const {routes} = this.props;
        const menuRoutes = routes.map(function (route, index) {
            let routeClasses = classNames(
                'menu__item', {
                    'cc--active': FlowHelpers.isCurrentRoute(route.name)
                }
            );
            return (
                <li key={index} className={routeClasses}>
                    {
                        <a className="" href={FlowRouter.url(route.name)}>
                            <i className={"icon-" + route.icon}/>
                            <span className="menu__label">{route.label}</span>
                            {
                                route.badge && <Badge num={route.badge}/>
                            }
                        </a>
                    }
                </li>
            )
        }, this);

        return (
            <ul className="left-menu__wrapper">
                {menuRoutes}
            </ul>
        )
    }
}