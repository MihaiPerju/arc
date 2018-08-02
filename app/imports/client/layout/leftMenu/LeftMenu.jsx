import React, { Component } from "react";
import Menu from "./Menu";
import classNames from "classnames";
import RoutesService from "./RoutesService";
import { withTracker } from "meteor/react-meteor-data";


class LeftMenu extends Component {
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

export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(LeftMenu);
