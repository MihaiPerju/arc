import React, {Component} from 'react';
import MenuItem from './MenuItem';
import FlowHelpers from '/imports/client/routing/helpers';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Menu extends Component {
    constructor() {
        super();
        this.state = {
            thisRoute: false
        }
    }

    componentDidMount() {
        FlowRouter.watchPathChange();
    }

    setActive = () => {
        const {routes} = this.props;
        const currRoute = FlowRouter.current().path;

        this.setState({
            thisRoute: currRoute.includes(routes.name)
        });
    }

    render() {
        const {routes} = this.props;

        const menuRoutes = routes.map(function (route, index) {
            const currRoute = FlowRouter.current().path;
            //Use this variable to display current route with highlighted background color
            const isCurrentRoute = currRoute.includes(route.name);
            // console.log(currRoute);
            // console.log(route.name);
            // console.log(isCurrentRoute);
            let routeClasses = classNames(
                'menu__item', {
                    'cc--active': isCurrentRoute
                }
            );

            return (
                <MenuItem
                    key={index}
                    className={routeClasses}
                    name={route.name}
                    href={FlowRouter.url(route.name)}
                    icon={route.icon}
                    label={route.label}
                    badge={route.badge}
                    active={this.setActive}
                />
            )
        }, this);

        return (
            <ul className="left-menu__wrapper">
                {menuRoutes}
            </ul>
        )
    }
}