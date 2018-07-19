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

export default class LeftMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      collapse: false
    };
  }

  collapseMenu = () => {
    const { collapse } = this.state;
    this.setState({
      collapse: !collapse
    });
  };

  render() {
    const { collapse } = this.state;

    const menuClasses = classNames({
      "left-menu": true,
      collapsed: collapse
    });

    let routes = RoutesService.getRoutesByRole();

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
