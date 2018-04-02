import React, {Component} from 'react';
import Badge from "/imports/client/lib/Badge";
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
        this.setActive();
    }

    setActive = () => {
        const currRoute = FlowRouter.current().path;
        const {routes} = this.props
        const {thisRoute} = this.state;
        //Use this variable to display current route with highlighted background color
        // const isCurrentRoute = currRoute.includes(route.name);
        this.setState({
            thisRoute: currRoute.includes(routes.name)
        });
        console.log('Curent Route: ' + currRoute);
        console.log(thisRoute)
    }

    render() {
        const {routes} = this.props;
        const {thisRoute} = this.state;
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
                            {
                                route.badge ? <Badge num={route.badge}/> : null
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