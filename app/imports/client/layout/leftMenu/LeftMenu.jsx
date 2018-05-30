import React, { Component } from "react";
import moment from "moment";
import UserRoles from "/imports/api/users/enums/roles";
import { createContainer } from "meteor/react-meteor-data";
import RolesEnum from "/imports/api/users/enums/roles";
import Menu from "./Menu";
import classNames from "classnames";
import accountListQuery from "/imports/api/accounts/queries/accountList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import Loading from "/imports/client/lib/ui/Loading";
import RoutesService from "./RoutesService";
import Accounts from "/imports/api/accounts/collection";
import { withTracker } from "meteor/react-meteor-data";
import EscalateReason from "../../pages/accounts/components/AccountContent/EscalateReason";

class LeftMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      collapse: false,
      unassigned: 0,
      escalations: 0,
      tickles: 0
    };
  }

  componentWillReceiveProps = () => {
    this.countBadges();
  };

  countBadges = () => {
    const that = this;
    accountListQuery
      .clone({
        filters: {
          assigneeId: { $exists: false },
          workQueue: { $exists: false },
          escalateReason: { $exists: false },
          tickleDate: { $exists: false }
        }
      })
      .getCount((err, count) => {
        if (!err) {
          that.setState({ unassigned: count });
        }
      });

    accountListQuery
      .clone({ filters: { escalateReason: { $exists: true } } })
      .getCount((err, count) => {
        if (!err) {
          that.setState({ escalations: count });
        }
      });

    const today = moment();
    let startOfDay = moment(today).startOf("day");
    startOfDay = startOfDay.add(1, "day");

    accountListQuery
      .clone({
        filters: {
          tickleDate: { 
            $lt: new Date(moment(startOfDay).format()) 
          },
          tickleUserId: Meteor.userId()
        }
      })
      .getCount((err, count) => {
        if (!err) {
          that.setState({ tickles: count });
        }
      });
  };
  componentWillMount = () => {
    this.countBadges();
  };

  collapseMenu = () => {
    const { collapse } = this.state;
    this.setState({
      collapse: !collapse
    });
  };

  render() {
    const { collapse, unassigned, escalations, tickles } = this.state;

    const menuClasses = classNames({
      "left-menu": true,
      collapsed: collapse
    });

    let routes = RoutesService.getRoutesByRole({
      unassigned,
      escalations,
      tickles
    });

    return (
      <div>
        {Meteor.userId() && (
          <div className={menuClasses}>
            <Menu routes={routes} />
            <div
              className="btn-collapse text-center"
              onClick={this.collapseMenu}
            >
              <i className="icon-angle-left" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withTracker(props => {
  const total = Accounts.find().count();
  return {
    total
  };
})(LeftMenu);
