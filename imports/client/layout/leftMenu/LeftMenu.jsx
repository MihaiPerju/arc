import React, {Component} from 'react';
import UserRoles from '/imports/api/users/enums/roles';
import {createContainer} from 'meteor/react-meteor-data';
import RolesEnum from '/imports/api/users/enums/roles';
import Menu from './Menu';
import classNames from 'classnames';
import accountListQuery from '/imports/api/tasks/queries/taskList';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';
import RolesService from './RolesService';

class LeftMenu extends Component {
    constructor() {
        super();
        this.state = {
            collapse: false
        }
    }

    collapseMenu = () => {
        const {collapse} = this.state;
        this.setState({
            collapse: !collapse
        })
    };

    render() {
        const {data, loading, error, currRoute} = this.props;

        const {collapse} = this.state;

        const menuClasses = classNames({
            'left-menu': true,
            'collapsed': collapse
        });

        let routes = RolesService.getRoutesByRole(data);

        if (loading) {
            return <Loading/>
        }

        return (
            <div>
                {Meteor.userId() &&
                <div className={menuClasses}>
                    <Menu routes={routes}/>
                    <div className="btn-collapse text-center" onClick={this.collapseMenu}>
                        <i className="icon-angle-left"/>
                    </div>
                </div>
                }
            </div>
        )
    }
}

const now = new Date;

export default withQuery((props) => {
    const currRoute = FlowRouter.current().path;
    return accountListQuery.clone({
        filters: {
            tickleDate: {
                $exists: true,
                $lte: now
            }
        }
    });
}, {reactive: true})(LeftMenu)