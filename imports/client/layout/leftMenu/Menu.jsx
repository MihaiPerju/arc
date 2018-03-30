import React, {Component} from 'react';
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
            const currRoute = FlowRouter.current().path;
            //Use this variable to display current route with highlighted background color
            const isCurrentRoute = currRoute.includes(route.name);
            let routeClasses = classNames(
                'menu__item', {
                    'cc--active': isCurrentRoute
                }
            );
            return (
                <li key={index} className={routeClasses}>
                    {
                        <a className="" href={FlowRouter.url(route.name)}>
                            <i className={"icon-" + route.icon}/>
                            <span className="menu__label">{route.label}</span>
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